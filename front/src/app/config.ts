/* eslint-disable @typescript-eslint/naming-convention */

export const deviceValues = {
  type: {
    LIGHT: 'cz',
    VALVE: 'wkf',
  },
  valve: {
    mode: {
      OFF: 'off',
      AUTO: 'auto',
      MANUAL: 'manual',
    },
    state: {
      OPEN: 'opened',
      CLOSE: 'closed',
    },
    temp: {
      min: 5,
      max: 35,
    },
  },
};
