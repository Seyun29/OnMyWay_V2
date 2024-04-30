import React, {useEffect, useState} from 'react';
import {TouchableOpacity} from 'react-native';
import FavoriteFilledSVG from '../../assets/images/favoriteFilled.svg';
import FavoriteNotFilledSVG from '../../assets/images/favoriteNotFilled.svg';
import {FAVORITE_KEY} from '../../config/consts/storage';
import {get, store} from '../../config/helpers/storage';

export default function FavoriteButton({addressName}: {addressName: string}) {
  const [isFav, setIsFav] = useState<boolean>(false);
  const onUseEffect = async () => {
    const res = await get(FAVORITE_KEY);
    if (res) {
      res.forEach((item, idx) => {
        if (item.addressName === addressName) {
          setIsFav(true);
        }
      });
    }
  };

  useEffect(() => {
    onUseEffect();
  }, [addressName]);

  const handlePress = async () => {
    if (isFav) {
      const favorites = await get(FAVORITE_KEY);
      const newFavorites = favorites?.filter(
        item => item.addressName !== addressName,
      );
      await store(FAVORITE_KEY, newFavorites);
      setIsFav(false);
    } else {
      console.log('favorite button pressed');
    }
  };

  return (
    <TouchableOpacity
      className="absolute right-2.5 bottom-14 z-10"
      onPress={() => {
        console.log('favorite button pressed');
      }}
      activeOpacity={0.2}>
      {isFav ? (
        <FavoriteFilledSVG height="50px" width="50px" />
      ) : (
        <FavoriteNotFilledSVG height="50px" width="50px" />
      )}
    </TouchableOpacity>
  );
}
