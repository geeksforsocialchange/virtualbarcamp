import React, {
  ChangeEvent,
  FormEvent,
  forwardRef,
  MouseEvent,
  useCallback,
  useState,
} from "react";
import { gql, useMutation } from "@apollo/client";
import { removeTalk, removeTalkVariables } from "./graphql/removeTalk";
import { updateTalk, updateTalkVariables } from "./graphql/updateTalk";

const REMOVE_TALK_MUTATION = gql`
  mutation removeTalk($slotId: ID!) {
    removeTalk(slotId: $slotId) {
      id
      talk {
        id
        title
        isMine
        isOpenDiscussion
        speakers {
          id
          name
        }
      }
    }
  }
`;

const UPDATE_TALK_MUTATION = gql`
  mutation updateTalk(
    $talkId: ID!
    $title: String!
    $isOpenDiscussion: Boolean!
    $additionalSpeakers: [ID!]!
  ) {
    updateTalk(
      talkId: $talkId
      title: $title
      isOpenDiscussion: $isOpenDiscussion
      additionalSpeakers: $additionalSpeakers
    ) {
      id
      title
      isOpenDiscussion
      speakers {
        id
        name
      }
    }
  }
`;

const Talk = forwardRef<
  HTMLDivElement,
  {
    id: string;
    slotId: string;
    title: string;
    isMine: boolean;
    isOpenDiscussion: boolean;
    speakers: { id: string; name: string }[];
    availableSpeakers: { id: string; name: string }[];
  }
>(({ id, slotId, isMine, title, isOpenDiscussion, speakers, availableSpeakers }, ref) => {
  const [updateWindowOpened, setUpdateWindowOpened] = useState<boolean>(false);

  const [newTitle, setNewTitle] = useState<string>(title);
  const [newIsOpenDiscussion, setNewIsOpenDiscussion] = useState<boolean>(isOpenDiscussion);
  const [newAdditionalSpeakers, setNewAdditionalSpeakers] = useState<string[]>(
    speakers.slice(1).map(({ id }) => id),
  );

  const changeNewTitle = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setNewTitle(ev.currentTarget.value);
    },
    [setNewTitle],
  );
  const changeNewIsOpenDiscussion = useCallback(
    (ev: ChangeEvent<HTMLInputElement>) => {
      setNewIsOpenDiscussion(ev.currentTarget.checked);
    },
    [setNewIsOpenDiscussion],
  );
  const changeNewAdditionalSpeakers = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      setNewAdditionalSpeakers(
        Array.from(ev.currentTarget.selectedOptions).map(({ value }) => value),
      );
    },
    [setNewAdditionalSpeakers],
  );

  const [removeTalkMutation, { error: removeError, loading: removeLoading }] = useMutation<
    removeTalk,
    removeTalkVariables
  >(REMOVE_TALK_MUTATION, { variables: { slotId } });

  const [updateTalkMutation, { error: updateError, loading: updateLoading }] = useMutation<
    updateTalk,
    updateTalkVariables
  >(UPDATE_TALK_MUTATION, {
    variables: {
      talkId: id,
      title: newTitle,
      isOpenDiscussion: newIsOpenDiscussion,
      additionalSpeakers: newAdditionalSpeakers,
    },
  });

  const updateTalk = useCallback(
    (ev: FormEvent<HTMLFormElement>) => {
      ev.preventDefault();
      if (ev.currentTarget.reportValidity()) {
        updateTalkMutation().then(() => setUpdateWindowOpened(false));
      }
    },
    [updateTalkMutation, setUpdateWindowOpened],
  );

  const removeTalk = useCallback(
    (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      if (window.confirm("Are you sure you want to remove this talk?")) {
        removeTalkMutation();
      }
    },
    [removeTalkMutation],
  );

  const openUpdateWindow = useCallback(
    (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      setNewTitle(title);
      setNewIsOpenDiscussion(isOpenDiscussion);
      setNewAdditionalSpeakers(speakers.slice(1).map(({ id }) => id));
      setUpdateWindowOpened(true);
    },
    [
      setNewTitle,
      title,
      setNewIsOpenDiscussion,
      isOpenDiscussion,
      setNewAdditionalSpeakers,
      speakers,
      setUpdateWindowOpened,
    ],
  );

  const closeUpdateWindow = useCallback(
    (ev: MouseEvent<HTMLButtonElement>) => {
      ev.preventDefault();
      setUpdateWindowOpened(false);
    },
    [setUpdateWindowOpened],
  );

  if (removeError || updateError) {
    return (
      <div className="message">
        <div className="message-header">An error has occurred</div>
        <div className="message-body">
          <p>An error occurred when updating this talk (please refresh)</p>
          <pre>{(removeError || updateError)?.message}</pre>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className={"talk"}>
      <h3 className="title is-size-4">{title}</h3>
      {isMine ? (
        <>
          <div className={`modal ${updateWindowOpened ? "is-active" : ""}`}>
            <div className="modal-background" />
            <form className="modal-card" onSubmit={updateTalk}>
              <div className="modal-card-head">
                <p className="modal-card-title">Edit talk</p>
                <button className="delete" aria-label="close" onClick={closeUpdateWindow} />
              </div>
              <div className="modal-card-body">
                <div className="field">
                  <label className="label" htmlFor="title">
                    Talk Title
                  </label>
                  <div className="control">
                    <input
                      className="input"
                      id="title"
                      type="text"
                      required
                      value={newTitle}
                      onChange={changeNewTitle}
                    />
                  </div>
                </div>
                <div className="field">
                  <label className="label" htmlFor="additional-speakers">
                    Additional speakers
                  </label>
                  <div className="control">
                    <div className="select is-multiple">
                      <select
                        id="additional-speakers"
                        multiple
                        value={newAdditionalSpeakers}
                        onChange={changeNewAdditionalSpeakers}
                      >
                        {availableSpeakers.map(({ id, name }) => (
                          <option key={id} value={id}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="field">
                  <div className="control">
                    <label className="checkbox">
                      <input
                        type="checkbox"
                        checked={newIsOpenDiscussion}
                        onChange={changeNewIsOpenDiscussion}
                      />{" "}
                      Open discussion
                    </label>
                  </div>
                </div>
              </div>
              <div className="modal-card-foot">
                <button className="button is-success">Save changes</button>
                <button className="button is-danger" onClick={removeTalk}>
                  Remove talk
                </button>
                <button className="button" onClick={closeUpdateWindow}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
          <button className="edit" aria-label="Edit talk" onClick={openUpdateWindow}>
            ✎
          </button>
        </>
      ) : null}
      <div className="talk__speakers">
        {isOpenDiscussion ? (
          <span className="talk__is-open-discussion">Open Discussion</span>
        ) : null}
        {speakers.map(({ name }, i) => `${i > 0 ? ", " : ""}${name}`)}
      </div>
    </div>
  );
});

export default Talk;
