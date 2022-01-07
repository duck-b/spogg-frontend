// env 설정
import GLOBAL from './config/global';

const deployType = process.env.REACT_APP_DEPLOY_TYPE
  ? process.env.REACT_APP_DEPLOY_TYPE
  : process.env.NODE_ENV;

export const envType = deployType;

// API URL
export const base_url = GLOBAL[deployType]['base_url'];
