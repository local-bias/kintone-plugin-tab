import styled from '@emotion/styled';
import {
  Autocomplete,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Skeleton,
  TextField,
  Tooltip,
} from '@mui/material';
import { produce } from 'immer';
import React, { FC, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { appGroupsState } from '../../../../states/kintone';
import { conditionState, groupDisplayModeState, groupsState } from '../../../../states/plugin';
import { useConditionIndex } from '../../../condition-index-provider';
import { FormPlaceholder } from './form-placeholder';

const Component: FC = () => {
  const conditionIndex = useConditionIndex();
  const appGroups = useRecoilValue(appGroupsState);
  const groupDisplayMode = useRecoilValue(groupDisplayModeState(conditionIndex));
  const groups = useRecoilValue(groupsState(conditionIndex));

  const onDisplayModeChange = useRecoilCallback(
    ({ set }) =>
      (_: any, value: string) => {
        set(groupDisplayModeState(conditionIndex), value as Plugin.DisplayMode);
      },
    [conditionIndex]
  );

  const onGroupChange = useRecoilCallback(
    ({ set }) =>
      (i: number, value: string) => {
        set(groupsState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft[i] = value;
          })
        );
      },
    [conditionIndex]
  );

  const addGroup = useRecoilCallback(
    ({ set }) =>
      (i: number) =>
        set(conditionState(conditionIndex), (current) =>
          produce(current, (draft) => {
            if (!draft) {
              return;
            }
            if (!draft.groups) {
              draft.groups = [''];
            } else {
              draft.groups.splice(i + 1, 0, '');
            }
          })
        ),
    [conditionIndex]
  );
  const removeGroup = useRecoilCallback(
    ({ set }) =>
      (i: number) =>
        set(groupsState(conditionIndex), (current) =>
          produce(current, (draft) => {
            if (draft.length === 1) {
              draft[0] = '';
            } else {
              draft.splice(i, 1);
            }
          })
        ),
    [conditionIndex]
  );

  return (
    <div className='grid grid-cols-[300px_1fr]'>
      <div className='left'>
        <RadioGroup defaultValue='sub' value={groupDisplayMode} onChange={onDisplayModeChange}>
          <FormControlLabel value='add' control={<Radio />} label='指定したグループだけ表示' />
          <FormControlLabel value='sub' control={<Radio />} label='指定したグループを非表示' />
        </RadioGroup>
      </div>
      <div className='right'>
        <h3>{groupDisplayMode === 'add' ? '表示する' : '表示しない'}グループ</h3>
        <div className='grid gap-4'>
          {groups.map((field, i) => (
            <div key={i} className='flex gap-2 items-center'>
              <Autocomplete
                value={appGroups.find((group) => group.code === field) ?? null}
                sx={{ width: '350px' }}
                options={appGroups}
                isOptionEqualToValue={(option, v) => option.code === v.code}
                getOptionLabel={(option) => option.code}
                onChange={(_, group) => onGroupChange(i, group?.code ?? '')}
                renderInput={(params) => (
                  <TextField {...params} label='対象グループ' variant='outlined' color='primary' />
                )}
              />
              <Tooltip title='フィールドを追加する'>
                <IconButton size='small' onClick={() => addGroup(i)}>
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              <Tooltip title='このフィールドを削除する'>
                <IconButton size='small' onClick={() => removeGroup(i)}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Tooltip>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Container: FC = (props) => (
  <Suspense fallback={<FormPlaceholder />}>
    <Component {...props} />
  </Suspense>
);

export default memo(Container);
