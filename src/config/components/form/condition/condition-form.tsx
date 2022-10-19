import React, { ChangeEventHandler, FC, FCX } from 'react';
import { useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import produce from 'immer';

import { storageState } from '../../../states/plugin';
import { TextField } from '@mui/material';

import FieldForm from './form-fields';
import GroupForm from './form-groups';
import SpaceForm from './form-spaces';
import LabelForm from './form-labels';

type ContainerProps = { condition: kintone.plugin.Condition; index: number };
type Props = ContainerProps & {
  onTabNameChange: ChangeEventHandler<HTMLInputElement>;
  onTabIconChange: ChangeEventHandler<HTMLInputElement>;
};

const Component: FCX<Props> = (props) => (
  <div className={props.className}>
    <div>
      <h3>タブ情報</h3>
      <div className='form-components'>
        <TextField
          className='input'
          label='タブ名'
          variant='outlined'
          value={props.condition.tabName}
          onChange={props.onTabNameChange}
        />
      </div>
    </div>
    <FieldForm conditionIndex={props.index} />
    <GroupForm conditionIndex={props.index} />
    <SpaceForm conditionIndex={props.index} />
    <LabelForm conditionIndex={props.index} />
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

const Container: FC<ContainerProps> = ({ condition, index }) => {
  const setStorage = useSetRecoilState(storageState);

  const setConditionProps = <T extends keyof kintone.plugin.Condition>(
    key: T,
    value: kintone.plugin.Condition[T]
  ) => {
    setStorage((_, _storage = _!) =>
      produce(_storage, (draft) => {
        draft.conditions[index][key] = value;
      })
    );
  };

  const onTabNameChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setConditionProps('tabName', e.target.value);
  };
  const onTabIconChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setConditionProps('tabIcon', e.target.value);
  };

  return (
    <StyledComponent
      {...{
        condition,
        index,
        onTabNameChange,
        onTabIconChange,
      }}
    />
  );
};

export default Container;
