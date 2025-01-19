import { DisplayMode } from '@/lib/plugin';
import { useArray } from '@konomi-app/kintone-utilities-jotai';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Autocomplete,
  FormControlLabel,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from '@mui/material';
import { produce } from 'immer';
import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { FC, memo, Suspense, useCallback } from 'react';
import { appGroupsAtom } from '../../../../states/kintone';
import { groupDisplayModeState, groupsState } from '../../../../states/plugin';
import { FormPlaceholder } from './form-placeholder';

const Component: FC = () => {
  const appGroups = useAtomValue(appGroupsAtom);
  const groupDisplayMode = useAtomValue(groupDisplayModeState);
  const groups = useAtomValue(groupsState);
  const { addItem, deleteItem } = useArray(groupsState);

  const onDisplayModeChange = useAtomCallback(
    useCallback((_, set, __: any, value: string) => {
      set(groupDisplayModeState, value as DisplayMode);
    }, [])
  );

  const onGroupChange = useAtomCallback(
    useCallback((_, set, i: number, value: string) => {
      set(groupsState, (current) =>
        produce(current, (draft) => {
          draft[i] = value;
        })
      );
    }, [])
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
                <IconButton size='small' onClick={() => addItem({ index: i + 1, newItem: '' })}>
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              {groups.length > 1 && (
                <Tooltip title='このフィールドを削除する'>
                  <IconButton size='small' onClick={() => deleteItem(i)}>
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
};

const Container: FC = (props) => (
  <Suspense fallback={<FormPlaceholder />}>
    <Component {...props} />
  </Suspense>
);

export default memo(Container);
