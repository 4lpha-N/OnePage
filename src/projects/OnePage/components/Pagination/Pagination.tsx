import React from 'react';
import './Pagination.scss';
import MuiPagination from '@mui/material/Pagination';
import { Box } from '@mui/material';

interface PaginationProps {
  children: React.ReactNode;
  initialPage?: number;
}

export default function Pagination({ children, initialPage = 1 }: PaginationProps) {
  const childArray = React.Children.toArray(children);
  const count = childArray.length;
  const safePage = initialPage >= 1 && initialPage <= count ? initialPage : 1;
  const [page, setPage] = React.useState(safePage);

  return (
    <Box className="onepage-pagination">
      <Box className="onepage-pagination__content">{childArray[page - 1]}</Box>
      {childArray.length > 1 && (
        <MuiPagination
          count={count}
          page={page}
          defaultPage={initialPage}
          onChange={(_e, value) => setPage(value)}
          color="primary"
          showFirstButton={childArray.length > 2}
          showLastButton={childArray.length > 2}
        />
      )}
    </Box>
  );
}
