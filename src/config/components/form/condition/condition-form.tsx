import React, { ChangeEventHandler, VFC, VFCX } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import styled from '@emotion/styled';
import produce from 'immer';
import { Properties as FieldProperties } from '@kintone/rest-api-client/lib/client/types';

import { appFieldsState, storageState } from '../../../states';
import { FormControlLabel, IconButton, Radio, RadioGroup, TextField, Tooltip } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import FieldPropertiesSelect from './field-properties-select';

type ContainerProps = { condition: kintone.plugin.Condition; index: number };
type Props = ContainerProps & {
  onTabNameChange: ChangeEventHandler<HTMLInputElement>;
  onTabIconChange: ChangeEventHandler<HTMLInputElement>;
  onFieldsChange: (rowIndex: number, value: string) => void;
  addField: (rowIndex: number) => void;
  removeField: (rowIndex: number) => void;
  onDisplayModeChange: (_: any, value: string) => void;
};

const Component: VFCX<Props> = (props) => (
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
    <div>
      <h3>フィールドの指定方法</h3>
      <RadioGroup
        defaultValue='sub'
        value={props.condition.displayMode}
        onChange={props.onDisplayModeChange}
      >
        <FormControlLabel value='add' control={<Radio />} label='指定したフィールドを表示' />
        <FormControlLabel value='sub' control={<Radio />} label='指定したフィールドを非表示' />
      </RadioGroup>
    </div>
    <div>
      <h3>{props.condition.displayMode === 'sub' ? '表示しない' : '表示する'}フィールド</h3>
      <div className='rows'>
        {props.condition.fields.map((field, i) => (
          <div key={i}>
            <FieldPropertiesSelect
              label='フィールドコード'
              value={field}
              onChange={(e) => props.onFieldsChange(i, e.target.value)}
            />
            <Tooltip title='コピー設定を追加する'>
              <IconButton size='small' onClick={() => props.addField(i)}>
                <AddIcon fontSize='small' />
              </IconButton>
            </Tooltip>
            {props.condition.fields.length > 1 && (
              <Tooltip title='このコピー設定を削除する'>
                <IconButton size='small' onClick={() => props.removeField(i)}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            )}
          </div>
        ))}
      </div>
    </div>
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

const Container: VFC<ContainerProps> = ({ condition, index }) => {
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
