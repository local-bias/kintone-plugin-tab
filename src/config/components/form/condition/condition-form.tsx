import React, { ChangeEventHandler, FC, FCX } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import produce from 'immer';

import { storageState } from '../../../states/plugin';
import { appFieldsState } from '../../../states/kintone';
import { FormControlLabel, Radio, RadioGroup, TextField } from '@mui/material';

import GroupForm from './form-groups';
import LabelForm from './form-labels';
import FieldForm from './form-fields';

type ContainerProps = { condition: kintone.plugin.Condition; index: number };
type Props = ContainerProps & {
  onTabNameChange: ChangeEventHandler<HTMLInputElement>;
  onTabIconChange: ChangeEventHandler<HTMLInputElement>;
  onFieldsChange: (rowIndex: number, value: string) => void;
  addField: (rowIndex: number) => void;
  removeField: (rowIndex: number) => void;
  onDisplayModeChange: (_: any, value: string) => void;
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
  const dstAppProperties = useRecoilValue(appFieldsState);
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

  const onFieldsChange = (rowIndex: number, value: string) => {
    setStorage((_storage) =>
      produce(_storage, (draft) => {
        if (!draft) {
          return;
        }
        const { fields } = draft.conditions[index];
        fields[rowIndex] = value;
      })
    );
  };

  const addField = (rowIndex: number) => {
    setStorage((_storage) =>
      produce(_storage, (draft) => {
        if (!draft) {
          return;
        }
        const { fields } = draft.conditions[index];
        fields.splice(rowIndex + 1, 0, '');
      })
    );
  };

  const removeField = (rowIndex: number) => {
    setStorage((_storage) =>
      produce(_storage, (draft) => {
        if (!draft) {
          return;
        }
        const { fields } = draft.conditions[index];
        fields.splice(rowIndex, 1);
      })
    );
  };

  const onDisplayModeChange = (_: any, value: string) => {
    setConditionProps('displayMode', value as kintone.plugin.DisplayMode);
  };

  return (
    <StyledComponent
      {...{
        condition,
        index,
        onTabNameChange,
        onTabIconChange,
        onFieldsChange,
        addField,
        removeField,
        onDisplayModeChange,
      }}
    />
  );
};

export default Container;
