import { flatLayout } from '@/lib/kintone-api';
import { store } from '@/lib/store';
import { kintoneAPI } from '@konomi-app/kintone-utilities';
import { getSpaceElement, setFieldShown } from '@lb-ribbit/kintone-xapp';
import { appFieldsAtom, appLayoutAtom, selectedConditionAtom } from './states';

export const refresh = async () => {
  const condition = store.get(selectedConditionAtom);
  const fieldProperties = await store.get(appFieldsAtom);
  const layout = await store.get(appLayoutAtom);

  if (!fieldProperties || !layout) {
    process.env.NODE_ENV === 'development' &&
      console.error('fieldProperties or layout is not found');
    return;
  }

  Object.keys(fieldProperties).forEach((code) => {
    setFieldShown(code, true);
  });

  for (const code of Object.keys(fieldProperties)) {
    const exists = condition.fields.includes(code);
    setFieldShown(code, condition.displayMode === 'sub' ? !exists : exists);
  }

  const { groups = [], groupDisplayMode = 'sub' } = condition;
  const allGroups = getGroupFields(layout);
  for (const group of allGroups) {
    const exists = groups.includes(group.code);
    setFieldShown(group.code, groupDisplayMode === 'sub' ? !exists : exists);
  }

  const { spaceIds = [], spaceDisplayMode } = condition;
  const allSpaces = getSpaceFields(layout);
  for (const space of allSpaces) {
    const exists = spaceIds.includes(space.elementId);
    const spaceElement = getSpaceElement(space.elementId);
    if (!spaceElement) {
      continue;
    }
    const spaceWrapper = spaceElement.parentElement;
    if (!spaceWrapper) {
      continue;
    }
    if ((spaceDisplayMode === 'sub' && exists) || (spaceDisplayMode === 'add' && !exists)) {
      spaceWrapper.style.display = 'none';
    } else {
      spaceWrapper.style.display = 'block';
    }
  }

  const { labels = [], labelDisplayMode = 'sub' } = condition;
  const labelElements = [
    ...Array.from(document.querySelectorAll<HTMLDivElement>('.control-label-field-gaia')),
    ...Array.from(document.querySelectorAll<HTMLDivElement>('.control-value-label-gaia')),
  ];

  for (const labelElement of labelElements) {
    const text = labelElement.textContent;
    const exists = text && labels.some((label) => label === text);
    if ((labelDisplayMode === 'sub' && exists) || (labelDisplayMode === 'add' && !exists)) {
      labelElement.style.display = 'none';
    } else {
      labelElement.style.display = 'block';
    }
  }

  const { hidesHR = false } = condition;
  const hrElements = document.querySelectorAll<HTMLHRElement>('.hr-cybozu');
  hrElements.forEach((el) => (el.style.display = hidesHR ? 'none' : 'block'));

  process.env.NODE_ENV === 'development' && console.log('✨ refreshed');
};

const getGroupFields = (layout: kintoneAPI.Layout): kintoneAPI.layout.Group[] => {
  const groups = Object.values(layout).reduce<kintoneAPI.layout.Group[]>(
    (acc, value) => (value.type === 'GROUP' ? [...acc, value] : acc),
    []
  );
  return groups;
};

const getSpaceFields = (layout: kintoneAPI.Layout): kintoneAPI.layout.Spacer[] => {
  const fields = flatLayout(layout);
  const spaces = fields.filter((field) => field.type === 'SPACER') as kintoneAPI.layout.Spacer[];
  const filtered = spaces.filter((space) => space.elementId);
  return filtered;
};
