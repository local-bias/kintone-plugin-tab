import React, { FC, FCX } from 'react';
import styled from '@emotion/styled';

import TabNameForm from './form-tabname';
import FieldForm from './form-fields';
import GroupForm from './form-groups';
import SpaceForm from './form-spaces';
import LabelForm from './form-labels';
import HRForm from './form-hr';

type ContainerProps = { condition: kintone.plugin.Condition; index: number };
type Props = ContainerProps & {};

const Component: FCX<Props> = (props) => (
  <div className={props.className}>
    <div>
      <h3>タブ情報</h3>
      <div className='form-components'>
        <TabNameForm conditionIndex={props.index} />
      </div>
    </div>
    <FieldForm conditionIndex={props.index} />
    <GroupForm conditionIndex={props.index} />
    <SpaceForm conditionIndex={props.index} />
    <LabelForm conditionIndex={props.index} />
    <HRForm conditionIndex={props.index} />
  </div>
);

const StyledComponent = styled(Component)`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;

  > div {
    padding: 8px 8px 8px 16px;
    border-left: 2px solid #0002;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .input {
    min-width: 250px;
  }

  .form-components {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  small {
    color: #f80;
  }

  h3 {
    color: #0009;
    margin-bottom: 16px;
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
    > div {
      display: flex;
      align-items: center;
      gap: 8px;
      > svg {
        fill: #0006;
      }
    }
  }
`;

const Container: FC<ContainerProps> = (props) => {
  return <StyledComponent {...props} />;
};

export default Container;
