import React, { FC } from 'react';
import { hidesHRState, tabNameState } from '../../../states/plugin';

import FieldForm from './condition/form-fields';
import GroupForm from './condition/form-groups';
import SpaceForm from './condition/form-spaces';
import LabelForm from './condition/form-labels';
import ConditionDeletionButton from './condition-deletion-button';
import {
  PluginFormDescription,
  PluginFormSection,
  PluginFormTitle,
  RecoilSwitch,
  RecoilText,
} from '@konomi-app/kintone-utilities-react';

const Component: FC = () => {
  return (
    <div className='p-4'>
      <PluginFormSection>
        <PluginFormTitle>タブ情報</PluginFormTitle>
        <PluginFormDescription last>
          レコード登録画面・詳細画面に表示するタブのタブ名を設定します。
        </PluginFormDescription>
        <RecoilText state={tabNameState} className='input' label='タブ名' variant='outlined' />
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
      <PluginFormSection>
        <PluginFormTitle>罫線の設定</PluginFormTitle>
        <RecoilSwitch state={hidesHRState} label='罫線を全て非表示' />
      </PluginFormSection>
      <ConditionDeletionButton />
    </div>
  );
};

export default Component;
