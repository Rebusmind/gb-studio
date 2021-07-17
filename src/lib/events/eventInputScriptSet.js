const l10n = require("../helpers/l10n").default;

const id = "EVENT_SET_INPUT_SCRIPT";
const groups = ["EVENT_GROUP_INPUT"];

const autoLabel = (fetchArg) => {
  return l10n("FIELD_SET_INPUT_SCRIPT_LABEL", {
    input: fetchArg("input"),
  });
};

const fields = [
  {
    key: "input",
    type: "input",
    defaultValue: ["b"],
  },
  {
    key: "__scriptTabs",
    type: "tabs",
    defaultValue: "press",
    values: {
      press: l10n("FIELD_ON_PRESS"),
    },
  },
  {
    key: "true",
    label: l10n("FIELD_ON_PRESS"),
    type: "events",
    conditions: [
      {
        key: "__scriptTabs",
        in: [undefined, "press"],
      },
    ],
  },
];

const compile = (input, helpers) => {
  const { inputScriptSet } = helpers;
  inputScriptSet(input.input, input.persist, input.true);
};

module.exports = {
  id,
  autoLabel,
  groups,
  fields,
  compile,
};
