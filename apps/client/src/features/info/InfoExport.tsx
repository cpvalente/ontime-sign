import { memo } from 'react';
import { Box } from '@chakra-ui/react';
import { IoArrowUp } from '@react-icons/all-files/io5/IoArrowUp';

import ErrorBoundary from '../../common/components/error-boundary/ErrorBoundary';
import { handleLinks } from '../../common/utils/linkUtils';

import Info from './Info';

import style from '../editors/Editor.module.scss';

const InfoExport = () => {
  return (
    <Box className={style.info} data-testid='panel-info'>
      <IoArrowUp className={style.corner} onClick={(event) => handleLinks(event, 'info')} />
      <div className={style.content}>
        <ErrorBoundary>
          <Info />
        </ErrorBoundary>
      </div>
    </Box>
  );
}

export default memo(InfoExport)
