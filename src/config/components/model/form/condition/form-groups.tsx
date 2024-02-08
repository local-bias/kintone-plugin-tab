import {
  Autocomplete,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  InputLabel,
} from '@mui/material';
import { produce } from 'immer';
import React, { FC, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { appGroupsState } from '../../../../states/kintone';
import { groupDisplayModeState, groupsState } from '../../../../states/plugin';
import { FormPlaceholder } from './form-placeholder';
import { useRecoilRow } from '@konomi-app/kintone-utilities-react';

const Component: FC = () => {
  const appGroups = useRecoilValue(appGroupsState);
  const groupDisplayMode = useRecoilValue(groupDisplayModeState);
  const groups = useRecoilValue(groupsState);
  const { addRow, deleteRow } = useRecoilRow({ state: groupsState, getNewRow: () => '' });

  const onDisplayModeChange = useRecoilCallback(
    ({ set }) =>
      (_: any, value: string) => {
        set(groupDisplayModeState, value as Plugin.DisplayMode);
      },
    []
  );

  const onGroupChange = useRecoilCallback(
    ({ set }) =>
      (i: number, value: string) => {
        set(groupsState, (current) =>
          produce(current, (draft) => {
            draft[i] = value;
          })
        );
      },
    []
  );

  return (
    <div className='grid gap-2'>
      <RadioGroup defaultValue='sub' row value={groupDisplayMode} onChange={onDisplayModeChange}>
        <FormControlLabel value='add' control={<Radio />} label='指定したグループだけ表示' />
        <FormControlLabel value='sub' control={<Radio />} label='指定したグループを非表示' />
      </RadioGroup>
      <div>
        <InputLabel className='mb-2'>
          {groupDisplayMode === 'add' ? '表示する' : '表示しない'}グループ
        </InputLabel>
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
                <IconButton size='small' onClick={() => addRow(i)}>
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              <Tooltip title='このフィールドを削除する'>
                <IconButton size='small' onClick={() => deleteRow(i)}>
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
