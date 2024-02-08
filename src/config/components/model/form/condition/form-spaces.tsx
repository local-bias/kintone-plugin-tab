import styled from '@emotion/styled';
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
import React, { FC, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { appSpacesState } from '../../../../states/kintone';
import { spaceDisplayModeState, spaceIdsState } from '../../../../states/plugin';
import { FormPlaceholder } from './form-placeholder';
import { useRecoilRow } from '@konomi-app/kintone-utilities-react';

const Component: FC = () => {
  const appSpaces = useRecoilValue(appSpacesState);
  const spaceDisplayMode = useRecoilValue(spaceDisplayModeState);
  const spaceIds = useRecoilValue(spaceIdsState);
  const { addRow, deleteRow } = useRecoilRow({ state: spaceIdsState, getNewRow: () => '' });

  const onDisplayModeChange = useRecoilCallback(
    ({ set }) =>
      (_: any, value: string) => {
        set(spaceDisplayModeState, value as Plugin.DisplayMode);
      },
    []
  );

  const onSpaceIdChange = useRecoilCallback(
    ({ set }) =>
      (i: number, value: string) => {
        set(spaceIdsState, (current) =>
          produce(current, (draft) => {
            draft[i] = value;
          })
        );
      },
    []
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
