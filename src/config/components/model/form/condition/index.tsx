import React, { FC, FCX } from 'react';
import styled from '@emotion/styled';

import { useConditionIndex } from '../../../condition-index-provider';
import { useRecoilValue } from 'recoil';
import { tabIndexState } from '../../../../states/plugin';

import TabNameForm from './form-tabname';
import FieldForm from './form-fields';
import GroupForm from './form-groups';
import SpaceForm from './form-spaces';
import LabelForm from './form-labels';
import HRForm from './form-hr';
import ConditionDeletionButton from './condition-deletion-button';

const Component: FCX = ({ className }) => {
  return (
    <div className={className}>
      <div>
        <h3>タブ情報</h3>
        <div className='form-components'>
          <TabNameForm />
        </div>
      </div>
      <FieldForm />
      <GroupForm />
      <SpaceForm />
      <LabelForm />
      <HRForm />
      <ConditionDeletionButton />
    </div>
  );
};

const StyledComponent = styled(Component)`
  padding: 0 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;

  > div {
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .input {
    min-width: 250px;
  }

  .form-components {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  small {
    color: #f80;
  }

  h3 {
    color: #0009;
    margin-bottom: 16px;
  }

  .rows {
    display: flex;
    flex-direction: column;
    gap: 12px;
    > div {
      display: flex;
      align-items: center;
      gap: 8px;
      > svg {
        fill: #0006;
      }
    }
  }
`;

const Container: FC = () => {
  const conditionIndex = useConditionIndex();
  const tabIndex = useRecoilValue(tabIndexState);
  return conditionIndex === tabIndex ? <StyledComponent /> : null;
};

export default Container;
