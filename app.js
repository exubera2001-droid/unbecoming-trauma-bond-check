// The standalone share page mirrors Unbecoming's free reflection.
// Choices exist only in this page's memory and are never transmitted or stored.
const prompts = [
  {
    question: 'When things feel good again, do you find yourself setting aside something that hurt you?',
    detail: 'Think about your own experience, not whether anyone meant to hurt you.',
    title: 'The good moments and the hard ones',
    thought: 'Relief after a hard moment can feel powerful. It may help to make room for both the warmth and what happened before it, without having to decide what it all means today.',
  },
  {
    question: 'Do you spend time anticipating what might upset them, even during ordinary moments?',
    detail: 'For example, changing a small choice or rehearsing what you will say.',
    title: 'Making room for your own ease',
    thought: 'Being on alert can take a lot of energy. Your comfort and ability to make everyday choices are worth noticing too.',
  },
  {
    question: 'After a difficult exchange, do you feel pressure to repair things quickly, even when you need space?',
    detail: 'You can think about the pace that feels available to you.',
    title: 'Your pace matters',
    thought: 'Wanting things to feel settled makes sense. You are allowed to notice whether there is room for your feelings before the next repair.',
  },
  {
    question: 'When you consider stepping back, do you remember the caring moments more vividly than the reasons you needed distance?',
    detail: 'Missing someone and needing distance can exist at the same time.',
    title: 'Holding the fuller picture',
    thought: 'A caring memory does not cancel a difficult one. You do not have to argue yourself out of either feeling.',
  },
  {
    question: 'Do you find yourself questioning your memory of an event after talking about it with them?',
    detail: 'There is no need to share the event here.',
    title: 'Trusting what you notice',
    thought: 'Confusion can be unsettling. If it feels safe, you might give yourself time to notice what you remember before seeking someone else’s version.',
  },
  {
    question: 'Does the hope that things might change make it hard to attend to what you need right now?',
    detail: 'Hope is not a mistake. This is about making room for the present as well.',
    title: 'What you need today',
    thought: 'Hope and present needs can both matter. A small question to carry forward is: what would help you feel steadier today?',
  },
];

const choices = [
  ['often', 'This feels familiar'],
  ['sometimes', 'Sometimes'],
  ['not-really', 'Not really'],
  ['skip', 'I would rather not say'],
];
const answers = {};
let step = -1;
const check = document.getElementById('check');
const el = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text !== undefined) element.textContent = text;
  if (className) element.className = className;
  return element;
};
const button = (text, onClick, className = 'button') => {
  const element = el('button', text, className);
  element.type = 'button';
  element.addEventListener('click', onClick);
  return element;
};
const link = (text, href, className = 'button secondary') => {
  const element = el('a', text, className);
  element.href = href;
  return element;
};
const append = (...nodes) => check.append(...nodes);
const title = (text) => {
  const h = el('h1', text);
  h.tabIndex = -1;
  h.id = 'question-title';
  append(h);
  return h;
};
const eyebrow = (text) => append(el('span', text, 'eyebrow'));
const actions = (...items) => {
  const row = el('div', undefined, 'actions');
  row.append(...items);
  append(row);
};
const privacy = (heading, text) => {
  const box = el('div', undefined, 'privacy');
  box.append(el('strong', heading), el('p', text));
  append(box);
};
const move = (next) => { step = next; render(); window.scrollTo(0, 0); };
const restart = () => { for (const key of Object.keys(answers)) delete answers[key]; move(-1); };

function render() {
  check.replaceChildren();
  let heading;
  if (step === -1) {
    eyebrow('A free, private-to-this-page reflection');
    heading = title('Is this a trauma bond?');
    append(
      el('p', 'When care and hurt are tangled together, it can be hard to make sense of the pull. Take a few quiet moments to notice what feels familiar.', 'lead'),
      el('p', 'These questions are for reflection, not a test or diagnosis. You can skip any question. You do not need an account or to tell us your story.'),
    );
    privacy('Before you begin', 'Your choices stay on this page while it is open; they are not saved or sent to Nora or the community. Leaving or reloading clears them. If someone may check your device, this page may still appear in browser history. Quick exit opens another site but does not erase history.');
    actions(button('Begin reflecting  →', () => move(0)), link('Safety & support', '#support'));
  } else if (step < prompts.length) {
    const prompt = prompts[step];
    eyebrow(`A moment to notice · ${step + 1} of ${prompts.length}`);
    const progress = el('div', undefined, 'progress');
    progress.setAttribute('aria-hidden', 'true');
    prompts.forEach((_, index) => progress.append(el('span', undefined, index <= step ? 'active' : '')));
    append(progress);
    heading = title(prompt.question);
    append(el('p', prompt.detail, 'context'));
    const options = el('div', undefined, 'options');
    options.setAttribute('role', 'radiogroup');
    options.setAttribute('aria-labelledby', 'question-title');
    const next = button(step === prompts.length - 1 ? 'See your reflection  →' : 'Continue  →', () => move(step + 1));
    next.disabled = !answers[step];
    choices.forEach(([value, label]) => {
      const option = el('label', undefined, 'option');
      const input = el('input');
      input.type = 'radio';
      input.name = `reflection-${step}`;
      input.value = value;
      input.checked = answers[step] === value;
      input.addEventListener('change', () => { answers[step] = value; next.disabled = false; });
      option.append(input, el('span', label));
      options.append(option);
    });
    append(options);
    const skip = button('Skip this question', () => { answers[step] = 'skip'; move(step + 1); }, 'text-button');
    actions(next, button('←  Back', () => move(step - 1), 'button secondary'), skip);
  } else {
    eyebrow('A reflection, not a verdict');
    heading = title('What you noticed matters.');
    const reflected = prompts.filter((_, index) => ['often', 'sometimes'].includes(answers[index]));
    const answered = Object.values(answers).some((answer) => answer !== 'skip');
    if (reflected.length) {
      append(el('p', 'Some of your answers suggest moments worth giving more space to. None of them tells the whole story of a relationship.', 'lead'));
      reflected.forEach((prompt) => {
        const section = el('section', undefined, 'result');
        section.append(el('h2', prompt.title), el('p', prompt.thought));
        append(section);
      });
    } else {
      append(el('p', answered
        ? 'These particular experiences may not feel familiar right now. Your own sense of what feels comfortable or difficult still matters.'
        : 'You chose not to answer, and that is enough. You can read more, come back another time, or leave this here.', 'lead'));
    }
    privacy('There is no conclusion to reach here.', 'This check cannot determine what a relationship is, or what anyone should do next. If you feel unsafe or want to talk things through with a person, safety resources are available without an account.');
    actions(link('Find safety & support', '#support', 'button'), button('Start over', restart, 'button secondary'), button('←  Review answers', () => move(prompts.length - 1), 'text-button'));
  }
  append(el('p', 'If you are in immediate danger, contact local emergency services. Quick Exit and Cover do not erase browser history.', 'foot'));
  heading.focus({ preventScroll: true });
}

document.getElementById('cover-button').addEventListener('click', () => {
  document.getElementById('cover').hidden = false;
  document.getElementById('uncover-button').focus();
});
document.getElementById('uncover-button').addEventListener('click', () => {
  document.getElementById('cover').hidden = true;
  document.getElementById('cover-button').focus();
});
document.getElementById('exit-button').addEventListener('click', () => {
  window.location.replace('https://www.weather.com/');
});
render();