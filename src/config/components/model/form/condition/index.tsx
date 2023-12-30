import React, { FC } from 'react';
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
import {
  PluginFormDescription,
  PluginFormSection,
  PluginFormTitle,
} from '@konomi-app/kintone-utilities-react';

const Component: FC = () => {
  return (
    <div className='p-4'>
      <PluginFormSection>
        <PluginFormTitle>タブ情報</PluginFormTitle>
        <PluginFormDescription last>
          レコード登録画面・詳細画面に表示するタブのタブ名を設定します。
        </PluginFormDescription>
        <TabNameForm />
      </PluginFormSection>
      <PluginFormSection>
        <PluginFormTitle>フィールドの設定</PluginFormTitle>
        <FieldForm />
      </PluginFormSection>
      <PluginFormSection>
        <PluginFormTitle>グループフィールドの設定</PluginFormTitle>
        <GroupForm />
      </PluginFormSection>
      <PluginFormSection>
        <PluginFormTitle>スペースフィールドの設定</PluginFormTitle>
        <SpaceForm />
      </PluginFormSection>
      <PluginFormSection>
        <PluginFormTitle>ラベルフィールドの設定</PluginFormTitle>
        <PluginFormDescription last>
          ラベルはキー情報を持たないため、少しでもラベルに変更があると、表示・非表示の設定から外れてしまいます。
        </PluginFormDescription>
        <LabelForm />
      </PluginFormSection>
      <HRForm />
      <ConditionDeletionButton />
    </div>
  );
};

const Container: FC = () => {
  const conditionIndex = useConditionIndex();
  const tabIndex = useRecoilValue(tabIndexState);
  return conditionIndex === tabIndex ? <Component /> : null;
};

export default Container;
