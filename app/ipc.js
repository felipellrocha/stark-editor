import {
  writeFile,
  openFile,
  openAnimations,
} from 'actions';

export default {
  'save': writeFile, 
  'save-as': () => () => writeFile(true), 
  'open': openFile,
  'tiling-screen': () => () => { 
    window.location.hash = '/selector';
  },
  'settings-screen': () => () => { 
    window.location.hash = '/settings';
  },
  'animations-screen': () => () => { 
    window.location.hash = '/animations';
  },
}
