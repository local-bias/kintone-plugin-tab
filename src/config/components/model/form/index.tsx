import { JotaiSwitch, JotaiText } from '@konomi-app/kintone-utilities-jotai';
import {
  PluginFormDescription,
  PluginFormSection,
  PluginFormTitle,
} from '@konomi-app/kintone-utilities-react';
import { FC } from 'react';
import { hidesHRState, tabNameAtom } from '../../../states/plugin';
import ConditionDeletionButton from './condition-deletion-button';
import FieldForm from './condition/form-fields';
import GroupForm from './condition/form-groups';
import LabelForm from './condition/form-labels';
import SpaceForm from './condition/form-spaces';

const Component: FC = () => {
  return (
    <div className='p-4'>
      <PluginFormSection>
        <PluginFormTitle>タブ情報</PluginFormTitle>
        <PluginFormDescription last>
          レコード登録画面・詳細画面に表示するタブのタブ名を設定します。
        </PluginFormDescription>
        <JotaiText atom={tabNameAtom} className='input' label='タブ名' variant='outlined' />
      </PluginFormSection>
      <PluginFormSection>
        <PluginFormTitle>フィールドの設定</PluginFormTitle>
        <FieldForm />
      </PluginFormSection>
      <PluginFormSection>
        <PluginFormTitle>グループフィールドの設定</PluginFormTitle>
        <PluginFormDescription>
          タブを選択した際に表示・非表示にするグループを設定します。
        </PluginFormDescription>
        <PluginFormDescription last>
          <span className='text-red-500'>
            表示に設定しても、グループに所属するフィールドは影響を受けません。グループ内のフィールドを表示したい場合は、「フィールドの設定」からフィールドを指定する必要があります。
          </span>
        </PluginFormDescription>
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
        <JotaiSwitch atom={hidesHRState} label='罫線を全て非表示' />
      </PluginFormSection>
      <ConditionDeletionButton />
    </div>
  );
};

export default Component;
