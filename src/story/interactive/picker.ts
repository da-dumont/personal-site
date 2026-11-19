/*
  A one-of-several explorer, used by the intelligence loop. Buttons carry
  data-option="id"; notes carry data-note="id". Without JS every note is visible, so the
  content reads as a plain list. With JS only the chosen note shows, and the root's
  data-active lets CSS light up the matching part of the diagram.
*/

export interface Picker {
  select(id: string | null): void;
  readonly ids: string[];
}

export function picker(root: HTMLElement, onSelect?: (id: string | null) => void): Picker {
  const options = [...root.querySelectorAll<HTMLButtonElement>("[data-option]")];
  const notes = [...root.querySelectorAll<HTMLElement>("[data-note]")];
  const hint = root.querySelector<HTMLElement>("[data-note-hint]");

  const select = (id: string | null) => {
    if (id) root.dataset.active = id;
    else delete root.dataset.active;
    for (const option of options) option.setAttribute("aria-pressed", String(option.dataset.option === id));
    for (const note of notes) note.hidden = note.dataset.note !== id;
    if (hint) hint.hidden = id !== null;
    onSelect?.(id);
  };

  for (const option of options) {
    option.addEventListener("click", () => select(option.dataset.option ?? null));
  }
  select(root.dataset.active ?? null);
  return { select, ids: options.map((option) => option.dataset.option ?? "") };
}
