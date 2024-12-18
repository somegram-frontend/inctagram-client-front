import React from 'react';
import s from './filteredCards.module.scss'
import {Typography} from "@honor-ui/inctagram-ui-kit";

type Props = {
  image: string
  applyFilter: (filterCss: string) => void
}

const filters = [
  {
    id: 1,
    name: 'Grayscale',
    css: 'grayscale(100%)',
  },
  {
    id: 2,
    name: 'Sepia',
    css: 'sepia(100%)',
  },
  {
    id: 3,
    name: 'Blur',
    css: 'blur(5px)',
  },
  {
    id: 4,
    name: 'Brightness',
    css: 'brightness(1.5)',
  },
  {
    id: 5,
    name: 'Contrast',
    css: 'contrast(150%)',
  },
  {
    id: 6,
    name: 'Hue Rotate',
    css: 'hue-rotate(90deg)',
  },
  {
    id: 7,
    name: 'Invert',
    css: 'invert(100%)',
  },
  {
    id: 8,
    name: 'Saturate',
    css: 'saturate(200%)',
  },
  {
    id: 9,
    name: 'Opacity',
    css: 'opacity(50%)',
  },
];


export const FilteredCards = ({image, applyFilter}: Props) => {

  const handleFilterClick = (filterCss: string) => {
    applyFilter(filterCss);
  };

  return (
    <div className={s.cardFilter}>
      {filters.map(f => (
        <div key={f.id} className={s.cardItem} onClick={() => handleFilterClick(f.css)}>
          <img src={image} alt={f.name} className={s.imageFilter} style={{filter: f.css}}/>
          <div className={s.text}>{f.name}</div>
        </div>
      ))}
    </div>

  );
};
