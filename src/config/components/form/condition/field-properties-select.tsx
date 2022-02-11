import React, { VFC, VFCX } from 'react';
import styled from '@emotion/styled';
import { Properties as FieldProperties } from '@kintone/rest-api-client/lib/client/types';
import { MenuItem, TextField, Skeleton, TextFieldProps } from '@mui/material';
import { useRecoilValue } from 'recoil';
import { appFieldsState } from '../../../states';

type ContainerProps = TextFieldProps;
type Props = ContainerProps & { properties: FieldProperties };

const Component: VFCX<Props> = ({ className, properties, ...others }) => (
  <>
    {!properties && <Skeleton {...{ className }} />}
    {!!properties && (
      <TextField select {...{ ...others, className }}>
        {Object.values(properties).map(({ code, label }, i) => (
          <MenuItem key={i} value={code}>
            {label}
          </MenuItem>
        ))}
      </TextField>
    )}
  </>
);

const StyledComponent = styled(Component)`
  width: 250px;
  height: 56px;
`;

const Container: VFC<ContainerProps> = (props) => {
  const properties = useRecoilValue(appFieldsState);

  return <StyledComponent {...{ ...props, properties }} />;
};

export default Container;
