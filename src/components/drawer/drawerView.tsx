import React, {useState} from 'react';
import {
  Alert,
  Button,
  Linking,
  Platform,
  Text,
  TextInput,
  TextInputComponent,
  TouchableOpacity,
  View,
} from 'react-native';
import {login, logout, register} from '../../api/auth';
import {useRecoilState} from 'recoil';
import {userState} from '../../atoms/userState';

const DrawerView = () => {
  const [user, setUser] = useRecoilState(userState);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const isLoggedin = user.isLoggedIn;
  return (
    <View className="w-full h-full bg-white items-center py-10">
      {isLoggedin ? (
        <>
          <Text className="text-2xl mb-5">반가워요, {user.username}님</Text>
          <Button
            title="로그아웃"
            onPress={async () => {
              const response = await logout();
              console.log(response);
              setUser({
                isLoggedIn: false,
                username: '',
              });
            }}
          />
        </>
      ) : (
        <>
          <Text className="text-lg">로그인이 필요합니다</Text>
          <TextInput
            value={username}
            className={'mt-2 border-blacks border w-4/5 px-2 py-1 rounded-md'}
            placeholder="Enter your username here"
            autoCapitalize="none"
            onChangeText={text => setUsername(text)}
          />
          <TextInput
            value={password}
            className={'mt-5 border-blacks border w-4/5 px-2 py-1 rounded-md'}
            placeholder="Enter your password here"
            autoCapitalize="none"
            onChangeText={text => setPassword(text)}
          />
          <Button
            title="로그인"
            onPress={async () => {
              const response = await login({
                username,
                password,
              });
              if (response)
                setUser({
                  isLoggedIn: true,
                  username,
                });
            }}
          />
          <Button
            title="회원가입"
            onPress={async () => {
              const response = await register({
                username,
                password,
              });
              if (response) {
                setUsername('');
                setPassword('');
              }
              console.log(response);
            }}
          />
        </>
      )}
    </View>
  );
};

export default DrawerView;
