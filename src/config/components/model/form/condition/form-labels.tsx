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
import { appLabelsAtom } from '../../../../states/kintone';
import { labelDisplayModeState, labelsState } from '../../../../states/plugin';
import { FormPlaceholder } from './form-placeholder';

const Component: FC = () => {
  const allLabels = useAtomValue(appLabelsAtom);
  const labels = useAtomValue(labelsState);
  const labelDisplayMode = useAtomValue(labelDisplayModeState);
  const { addItem, deleteItem } = useArray(labelsState);

  const onDisplayModeChange = useAtomCallback(
    useCallback((_, set, __: any, value: string) => {
      set(labelDisplayModeState, value as DisplayMode);
    }, [])
  );

  const onLabelsChange = useAtomCallback(
    useCallback((_, set, i: number, value: string) => {
      set(labelsState, (current) =>
        produce(current, (draft) => {
          draft[i] = value;
        })
      );
    }, [])
  );

  return (
    <div className='grid gap-2'>
      <RadioGroup defaultValue='sub' row value={labelDisplayMode} onChange={onDisplayModeChange}>
        <FormControlLabel value='add' control={<Radio />} label='指定したラベルだけ表示' />
        <FormControlLabel value='sub' control={<Radio />} label='指定したラベルを非表示' />
      </RadioGroup>
      <div className='right'>
        <h3>{labelDisplayMode === 'add' ? '表示する' : '表示しない'}ラベル</h3>
        <div className='grid gap-4'>
          {labels.map((label, i) => (
            <div key={i} className='flex gap-2 items-center'>
              <Autocomplete
                value={label}
                fullWidth
                options={allLabels}
                onChange={(_, lbl) => onLabelsChange(i, lbl ?? '')}
                renderInput={(params) => (
                  <TextField {...params} label='対象ラベル' variant='outlined' color='primary' />
                )}
              />
              <Tooltip title='フィールドを追加する'>
                <IconButton size='small' onClick={() => addItem({ index: i + 1, newItem: '' })}>
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              {labels.length > 1 && (
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
