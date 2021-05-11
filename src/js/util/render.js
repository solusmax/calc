export const renderNode = (container, template, position = 'beforeend') => {
  container.insertAdjacentHTML(position, template);
};
