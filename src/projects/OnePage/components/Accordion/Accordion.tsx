import React from 'react';
import './Accordion.scss';
import MuiAccordion from '@mui/material/Accordion';
import Typography from '@mui/material/Typography';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box } from '@mui/material';

interface AccordionItemProps {
  title: string;
  children: React.ReactNode;
}

// Dient nur als Datenträger – der Parent rendert den eigentlichen Inhalt
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function AccordionItem(_props: AccordionItemProps) {
  return null;
}

interface AccordionProps {
  children: React.ReactElement<AccordionItemProps> | React.ReactElement<AccordionItemProps>[];
  initialOpen?: number;
}

export default function Accordion({ children, initialOpen }: AccordionProps) {
  const items = React.Children.toArray(children) as React.ReactElement<AccordionItemProps>[];
  const count = items.length;
  const [expanded, setExpanded] = React.useState(
    initialOpen && initialOpen >= 1 && initialOpen <= count ? initialOpen : 0
  );

  const handleChange = (index: number) => {
    setExpanded((prev) => (prev === index ? 0 : index));
  };

  return (
    <Box className="onepage-Accordion">
      {items.map((item, index) => (
        <MuiAccordion
          key={index}
          elevation={0}
          disableGutters={false}
          className="onepage-accordion"
          expanded={expanded === index + 1}
          onChange={() => handleChange(index + 1)}
          sx={(theme) => ({
            backgroundColor: 'var(--bg-lighter2)',
            transition: `${theme.transitions.create('margin')}, var(--transition)`,
            '& .MuiCollapse-root': {
              transition: `${theme.transitions.create('height')}, var(--transition)`,
            },
            '& .MuiAccordionSummary-root': {
              transition: `${theme.transitions.create('min-height')}, var(--transition)`,
            },
            '& .MuiAccordionSummary-expandIconWrapper': {
              transition: theme.transitions.create('transform'),
            },
          })}
        >
          <MuiAccordionSummary
            id={`accordion-summary-${index}`}
            aria-controls={`accordion-details-${index}`}
            expandIcon={<ExpandMoreIcon />}
            sx={{ padding: '0 16px 0 24px' }}
          >
            <Typography variant="subtitle1">{item.props.title}</Typography> {/* h6 */}
          </MuiAccordionSummary>
          <MuiAccordionDetails sx={{ padding: '8px 16px 16px 24px' }}>
            {item.props.children}
          </MuiAccordionDetails>
        </MuiAccordion>
      ))}
    </Box>
  );
}
