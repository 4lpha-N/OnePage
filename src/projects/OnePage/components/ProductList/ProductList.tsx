import React, { useState, useCallback, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Container,
  Grid,
  Typography,
  Box,
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import { TiArrowMinimise, TiArrowMaximise } from 'react-icons/ti';
import { FaCartArrowDown } from 'react-icons/fa';
import './ProductList.scss';

// eslint-disable-next-line react-refresh/only-export-components
export const exampleProducts = [
  {
    id: 1,
    name: '1',
    price: 29.99,
    imageUrl: 'https://dummyimage.com/640x360/dc143c/fff',
  },
  {
    id: 2,
    name: '2',
    price: 49.99,
    imageUrl: 'https://dummyimage.com/640x360/dc143c/fff',
  },
  {
    id: 3,
    name: '3',
    price: 19.99,
    imageUrl: 'https://dummyimage.com/640x360/dc143c/fff',
  },
  {
    id: 4,
    name: '4',
    price: 99.99,
    imageUrl: 'https://dummyimage.com/640x360/dc143c/fff',
  },
  {
    id: 5,
    name: '5',
    price: 59.99,
    imageUrl: 'https://dummyimage.com/640x360/dc143c/fff',
  },
  {
    id: 6,
    name: '6',
    price: 59.99,
    imageUrl: 'https://dummyimage.com/640x360/dc143c/fff',
  },
  {
    id: 7,
    name: '7',
    price: 59.99,
    imageUrl: 'https://dummyimage.com/640x360/dc143c/fff',
  },
];

interface ProductListProps {
  products: {
    id: number;
    name: string;
    price: number;
    imageUrl: string;
  }[];
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);
};

const SPRING = { type: 'spring' as const, stiffness: 300, damping: 30 };

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isClosing, setIsClosing] = useState(false);
  const selectedProduct = products.find((p) => p.id === selectedId) ?? null;
  const [portalTarget, setPortalTarget] = useState<Element | null>(null);
  const openButtonRef = useRef<HTMLButtonElement | null>(null);

  const containerCallbackRef = useCallback((el: HTMLDivElement | null) => {
    if (el) setPortalTarget(el.closest('.onepage-content') ?? null);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedId(null);
      setIsClosing(false);
      requestAnimationFrame(() => {
        const el = openButtonRef.current;
        if (el) {
          el.focus();
        }
      });
    }, 220);
  };

  return (
    <Container
      ref={containerCallbackRef}
      maxWidth="xl"
      className="product-list"
      sx={{ position: 'relative', paddingBottom: '32px' }}
    >
      <Grid container spacing={4} className="product-grid" inert={selectedId !== null}>
        {products.map((product) => (
          <Grid key={product.id} size={{ xs: 12, sm: 6, md: 6, lg: 4, xl: 3 }}>
            <Box
              className="product-item"
              sx={{ visibility: selectedId === product.id ? 'hidden' : 'visible' }}
            >
              <motion.div
                layoutId={`card-${product.id}`}
                transition={SPRING}
                style={{ borderRadius: 4, overflow: 'hidden' }}
              >
                <Card
                  sx={{
                    backgroundColor: 'var(--bg-lighter2)',
                    boxShadow: 'none',
                    transition:
                      'box-shadow 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, var(--transition)',
                    backgroundImage: 'none',
                  }}
                >
                  <CardActionArea disabled>
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.imageUrl}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {product.name}
                      </Typography>
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Lorem ipsum
                      </Typography>
                      <Typography variant="h6" sx={{ marginTop: '24px' }}>
                        {formatPrice(product.price)}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions sx={{ justifyContent: 'space-between', gap: '16px' }}>
                    <Button color="secondary">
                      <FaCartArrowDown size={24} />
                    </Button>
                    <Button
                      color="secondary"
                      onClick={(e) => {
                        openButtonRef.current = e.currentTarget;
                        setSelectedId(product.id);
                      }}
                    >
                      <TiArrowMaximise size={32} />
                    </Button>
                  </CardActions>
                </Card>
              </motion.div>
            </Box>
          </Grid>
        ))}
      </Grid>

      {portalTarget &&
        createPortal(
          <AnimatePresence>
            {selectedProduct && (
              <motion.div
                layoutId={`card-${selectedId}`}
                transition={SPRING}
                className="product-detail-motion"
                style={{ borderRadius: 4 }}
              >
                <Box
                //   sx={{
                //     backgroundColor: 'var(--bg-lighter2)',
                //   }}
                >
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: isClosing ? 0 : 1 }}
                    exit={{ opacity: 0, transition: { duration: 0 } }}
                    transition={{ duration: 0.2, delay: isClosing ? 0 : 0.25 }}
                    style={{ height: '100%', overflow: 'auto' }}
                    className="product-detail-motion__content"
                  >
                    <Box className="product-detail">
                      {/* sx={{ background: 'var(--bg-lighter2)' }} */}
                      <Container maxWidth="xl" sx={{ paddingBottom: '32px' }}>
                        <Box className="product-detail__head">
                          <IconButton
                            onClick={handleClose}
                            className="product-detail__back"
                            aria-label="Zurück"
                            color="secondary"
                          >
                            <TiArrowMinimise size={32} />
                          </IconButton>
                        </Box>

                        <Grid container spacing={6}>
                          <Grid size={{ xs: 12, md: 6 }}>
                            <Box className="product-detail__image-wrap">
                              <img
                                src={selectedProduct.imageUrl}
                                alt={selectedProduct.name}
                                className="product-detail__image"
                              />
                            </Box>
                          </Grid>

                          <Grid size={{ xs: 12, md: 6 }}>
                            <Box className="product-detail__info">
                              <Typography variant="h3" component="h1" gutterBottom>
                                {selectedProduct.name}
                              </Typography>
                              <Typography variant="h4" color="primary" gutterBottom>
                                {formatPrice(selectedProduct.price)}
                              </Typography>

                              <Divider sx={{ my: 3 }} />

                              <Typography variant="body1" paragraph>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                                ad minim veniam, quis nostrud exercitation ullamco.
                              </Typography>
                              <Typography variant="body1" paragraph>
                                Duis aute irure dolor in reprehenderit in voluptate velit esse
                                cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                                cupidatat non proident. Duis aute irure dolor in reprehenderit in
                                voluptate velit esse cillum dolore eu fugiat nulla pariatur.
                                Excepteur sint occaecat cupidatat non proident.
                              </Typography>

                              <Divider sx={{ my: 3 }} />

                              <Box className="product-detail__meta">
                                <Typography variant="body2" color="text.secondary">
                                  <strong>Attribut:</strong> Wert
                                </Typography>
                              </Box>

                              <Box className="product-detail__actions">
                                <Button variant="contained" color="primary" size="large" fullWidth>
                                  Aktion
                                </Button>
                              </Box>
                            </Box>
                          </Grid>
                        </Grid>
                      </Container>
                    </Box>
                  </motion.div>
                </Box>
              </motion.div>
            )}
          </AnimatePresence>,
          portalTarget
        )}
    </Container>
  );
};

export default ProductList;
