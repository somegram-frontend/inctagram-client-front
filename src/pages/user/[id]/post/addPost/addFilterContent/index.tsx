import React, {useState} from 'react';
import s from "./addFilterContent.module.scss";
import PhotoSlider from "@/components/photoSlider";
import Image from "next/image";
import {Button, Close, PinOutline, PlusCircleOutline, Select, TextArea, Typography} from "@honor-ui/inctagram-ui-kit";
import style from "@/pages/user/[id]/post/addPost/addPost.module.scss";
import {FilteredCards} from "@/pages/user/[id]/post/addPost/addFilterContent/filteredCards";

type Props = {
  images: string[]
  handleSetFilter: (filter: string) => void
}

export const AddFilterContent = ({images, handleSetFilter}: Props) => {

  const [appliedFilter, setAppliedFilter] = useState('');

  const applyFilter = (filterCss: string) => {
    setAppliedFilter(filterCss);
    handleSetFilter(filterCss)
  };

  return (
    <>
      <div className={s.publicWrapper}>
        <PhotoSlider images={images} appliedFilter={appliedFilter}/>
        <div className={s.filtersContainer}>
          <div>
            <FilteredCards image={images[0]} applyFilter={applyFilter}/>
          </div>
        </div>
      </div>
    </>
  );
};
