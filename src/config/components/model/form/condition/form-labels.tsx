import { DisplayMode } from '@/lib/plugin';
import { useRecoilRow } from '@konomi-app/kintone-utilities-react';
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
import { FC, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { appLabelsState } from '../../../../states/kintone';
import { labelDisplayModeState, labelsState } from '../../../../states/plugin';
import { FormPlaceholder } from './form-placeholder';

const Component: FC = () => {
  const allLabels = useRecoilValue(appLabelsState);
  const labels = useRecoilValue(labelsState);
  const labelDisplayMode = useRecoilValue(labelDisplayModeState);
  const { addRow, deleteRow } = useRecoilRow({ state: labelsState, getNewRow: () => '' });

  const onDisplayModeChange = useRecoilCallback(
    ({ set }) =>
      (_: any, value: string) => {
        set(labelDisplayModeState, value as DisplayMode);
      },
    []
  );

  const onLabelsChange = useRecoilCallback(
    ({ set }) =>
      (i: number, value: string) => {
        set(labelsState, (current) =>
          produce(current, (draft) => {
            draft[i] = value;
          })
        );
      },
    []
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
                <IconButton size='small' onClick={() => addRow(i)}>
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              {labels.length > 1 && (
                <Tooltip title='このフィールドを削除する'>
                  <IconButton size='small' onClick={() => deleteRow(i)}>
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
