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
import produce from 'immer';
import React, { FC, FCX, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { labelDisplayModeState, labelsState } from '../../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { appLabelsState } from '../../../states/kintone';

type Props = { conditionIndex: number };

const Component: FCX<Props> = ({ className, conditionIndex }) => {
  const allLabels = useRecoilValue(appLabelsState);
  const labels = useRecoilValue(labelsState(conditionIndex));
  const labelDisplayMode = useRecoilValue(labelDisplayModeState(conditionIndex));

  const onDisplayModeChange = useRecoilCallback(
    ({ set }) =>
      (_: any, value: string) => {
        set(labelDisplayModeState(conditionIndex), value as kintone.plugin.DisplayMode);
      },
    [conditionIndex]
  );

  const onLabelsChange = useRecoilCallback(
    ({ set }) =>
      (i: number, value: string) => {
        set(labelsState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft[i] = value;
          })
        );
      },
    [conditionIndex]
  );

  const addLabel = useRecoilCallback(
    ({ set }) =>
      (i: number) =>
        set(labelsState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft.splice(i + 1, 0, '');
          })
        ),
    [conditionIndex]
  );
  const removeLabel = useRecoilCallback(
    ({ set }) =>
      (i: number) =>
        set(labelsState(conditionIndex), (current) =>
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
    <section className={className}>
      <h3>ラベルフィールドの設定</h3>
      <small style={{ display: 'block', marginBottom: '16px' }}>
        ラベルはキー情報を持たないため、少しでもラベルに変更があると、表示・非表示の設定から外れてしまいます。
      </small>
      <div className='form'>
        <div className='left'>
          <RadioGroup defaultValue='sub' value={labelDisplayMode} onChange={onDisplayModeChange}>
            <FormControlLabel value='add' control={<Radio />} label='指定したラベルだけ表示' />
            <FormControlLabel value='sub' control={<Radio />} label='指定したラベルを非表示' />
          </RadioGroup>
        </div>
        <div className='right'>
          <h3>{labelDisplayMode === 'add' ? '表示する' : '表示しない'}ラベル</h3>
          <div className='rows'>
            {labels.map((label, i) => (
              <div key={i}>
                <Autocomplete
                  value={label}
                  sx={{ width: '350px' }}
                  options={allLabels}
                  onChange={(_, lbl) => onLabelsChange(i, lbl ?? '')}
                  renderInput={(params) => (
                    <TextField {...params} label='対象ラベル' variant='outlined' color='primary' />
                  )}
                />
                <Tooltip title='フィールドを追加する'>
                  <IconButton size='small' onClick={() => addLabel(i)}>
                    <AddIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='このフィールドを削除する'>
                  <IconButton size='small' onClick={() => removeLabel(i)}>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const StyledComponent = styled(Component)`
  border-left: 2px solid #0003;
  padding: 8px 8px 8px 16px;

  .form {
    display: flex;
    flex-direction: row;
    gap: 16px;

    .left {
      flex-basis: 350px;
    }
    .right {
      flex: 1;
    }
  }
`;

const Container: FC<Props> = (props) => {
  return (
    <Suspense
      fallback={
        <div>
          <Skeleton width={200} height={30} />
          <div style={{ display: 'flex' }}>
            <Skeleton style={{ marginRight: '120px' }} width={250} height={100} />
            <div>
              <Skeleton width={150} height={30} />
              <Skeleton width={400} height={80} />
              <Skeleton width={400} height={80} />
              <Skeleton width={400} height={80} />
            </div>
          </div>
        </div>
      }
    >
      <StyledComponent {...props} />
    </Suspense>
  );
};

export default Container;
