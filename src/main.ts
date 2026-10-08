
function wire(){
  document.addEventListener('click', e => {
    const t = e.target as HTMLElement;
    const actionEl = t.closest('[data-action]') as HTMLElement | null;
    const drawerContainer = t.closest('[data-stop]') as HTMLElement | null;

    if (drawerContainer && (!actionEl || !drawerContainer.contains(actionEl))) {
      e.stopPropagation();
      return;
    }
  });

  document.addEventListener('click',async e=>{const t=e.target as HTMLElement;const v=t.closest('[data-view]') as HTMLElement|null;if(v){state.view=v.dataset.view as View;state.mobileNav=false;render();}
