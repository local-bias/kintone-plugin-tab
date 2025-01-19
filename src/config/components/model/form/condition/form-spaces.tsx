import { DisplayMode } from '@/lib/plugin';
import { useArray } from '@konomi-app/kintone-utilities-jotai';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Autocomplete,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
} from '@mui/material';
import { produce } from 'immer';
import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { FC, memo, Suspense, useCallback } from 'react';
import { appSpacesState } from '../../../../states/kintone';
import { spaceDisplayModeState, spaceIdsState } from '../../../../states/plugin';
import { FormPlaceholder } from './form-placeholder';

const Component: FC = () => {
  const appSpaces = useAtomValue(appSpacesState);
  const spaceDisplayMode = useAtomValue(spaceDisplayModeState);
  const spaceIds = useAtomValue(spaceIdsState);
  const { addItem, deleteItem } = useArray(spaceIdsState);

  const onDisplayModeChange = useAtomCallback(
    useCallback((_, set, __: any, value: string) => {
      set(spaceDisplayModeState, value as DisplayMode);
    }, [])
  );

  const onSpaceIdChange = useAtomCallback(
    useCallback((_, set, i: number, value: string) => {
      set(spaceIdsState, (current) =>
        produce(current, (draft) => {
          draft[i] = value;
        })
      );
    }, [])
  );

  return (
    <div className='grid gap-2'>
      <RadioGroup defaultValue='sub' row value={spaceDisplayMode} onChange={onDisplayModeChange}>
        <FormControlLabel value='add' control={<Radio />} label='指定したスペースだけ表示' />
        <FormControlLabel value='sub' control={<Radio />} label='指定したスペースを非表示' />
      </RadioGroup>
      <div>
        <h3>{spaceDisplayMode === 'add' ? '表示する' : '表示しない'}スペース</h3>
        <div className='grid gap-4'>
          {spaceIds.map((spaceId, i) => (
            <div key={i} className='flex gap-2 items-center'>
              <Autocomplete
                value={appSpaces.find((spacer) => spacer.elementId === spaceId) ?? null}
                sx={{ width: '350px' }}
                options={appSpaces}
                isOptionEqualToValue={(option, v) => option.elementId === v.elementId}
                getOptionLabel={(option) => option.elementId}
                onChange={(_, group) => onSpaceIdChange(i, group?.elementId ?? '')}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label='対象スペースID'
                    variant='outlined'
                    color='primary'
                  />
                )}
              />
              <Tooltip title='フィールドを追加する'>
                <IconButton size='small' onClick={() => addItem({ index: i + 1, newItem: '' })}>
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              {spaceIds.length > 1 && (
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
