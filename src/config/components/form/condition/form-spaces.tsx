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
import { appSpacesState } from '../../../states/kintone';
import { spaceDisplayModeState, spaceIdsState } from '../../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

type Props = { conditionIndex: number };

const Component: FCX<Props> = ({ className, conditionIndex }) => {
  const appSpaces = useRecoilValue(appSpacesState);
  const spaceDisplayMode = useRecoilValue(spaceDisplayModeState(conditionIndex));
  const spaceIds = useRecoilValue(spaceIdsState(conditionIndex));

  const onDisplayModeChange = useRecoilCallback(
    ({ set }) =>
      (_: any, value: string) => {
        set(spaceDisplayModeState(conditionIndex), value as kintone.plugin.DisplayMode);
      },
    [conditionIndex]
  );

  const onSpaceIdChange = useRecoilCallback(
    ({ set }) =>
      (i: number, value: string) => {
        set(spaceIdsState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft[i] = value;
          })
        );
      },
    [conditionIndex]
  );

  const addSpaceId = useRecoilCallback(
    ({ set }) =>
      (i: number) =>
        set(spaceIdsState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft.splice(i + 1, 0, '');
          })
        ),
    [conditionIndex]
  );
  const removeSpaceId = useRecoilCallback(
    ({ set }) =>
      (i: number) =>
        set(spaceIdsState(conditionIndex), (current) =>
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
      <h3>スペースフィールドの設定</h3>
      <div className='form'>
        <div className='left'>
          <RadioGroup defaultValue='sub' value={spaceDisplayMode} onChange={onDisplayModeChange}>
            <FormControlLabel value='add' control={<Radio />} label='指定したグループだけ表示' />
            <FormControlLabel value='sub' control={<Radio />} label='指定したグループを非表示' />
          </RadioGroup>
        </div>
        <div className='right'>
          <h3>{spaceDisplayMode === 'add' ? '表示する' : '表示しない'}スペース</h3>
          <div className='rows'>
            {spaceIds.map((spaceId, i) => (
              <div key={i}>
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
                  <IconButton size='small' onClick={() => addSpaceId(i)}>
                    <AddIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
                <Tooltip title='このフィールドを削除する'>
                  <IconButton size='small' onClick={() => removeSpaceId(i)}>
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
