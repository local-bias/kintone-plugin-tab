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
import { useConditionIndex } from '../../../condition-index-provider';
import { appSpacesState } from '../../../../states/kintone';
import { spaceDisplayModeState, spaceIdsState } from '../../../../states/plugin';
import { FormPlaceholder } from './form-placeholder';

const Component: FC = () => {
  const conditionIndex = useConditionIndex();
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
    <div className='grid grid-cols-[300px_1fr]'>
      <div className='left'>
        <RadioGroup defaultValue='sub' value={spaceDisplayMode} onChange={onDisplayModeChange}>
          <FormControlLabel value='add' control={<Radio />} label='指定したスペースだけ表示' />
          <FormControlLabel value='sub' control={<Radio />} label='指定したスペースを非表示' />
        </RadioGroup>
      </div>
      <div className='right'>
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
  );
};

const Container: FC = (props) => (
  <Suspense fallback={<FormPlaceholder />}>
    <Component {...props} />
  </Suspense>
);

export default memo(Container);
