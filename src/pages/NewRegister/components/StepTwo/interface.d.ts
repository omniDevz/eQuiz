import { ChangeEvent } from 'react';

export interface StepTwoProps {
  values: {
    username: string;
    password: string;
    confirmPassword: string;
  };
  handleChange: FunctionComponentElement;
  handleStep: function(
    1 | 2 | 3,
    1 | 2 | 3
  );
}
