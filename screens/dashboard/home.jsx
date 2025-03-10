import React, {useEffect, useState, useCallback} from 'react';
import {
  useNavigation,
  useIsFocused,
} from '@react-navigation/native';
import {
  UserPlus,
  BookCopy,
  LogOutIcon,
  ArrowBigDownIcon,
  ArrowDown,
  Mail,
  BadgeAlert,
} from 'lucide-react-native';

import EncryptedStorage from 'react-native-encrypted-storage';

import {
  retrieveUserSession,
} from '../../config/functions';

import {
  Modal,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
  Image,
  Button,
  ImageBackground,
  Alert,
  KeyboardAvoidingView,
  BackHandler,
} from 'react-native';
import {LinearGradient} from 'react-native-svg';

import {isEnabled} from 'react-native/Libraries/Performance/Systrace';

import ComponentModal from '../../components/modal';
import LeaveModal from '../../components/leave_modal';
import {applyLeave} from '../../config/leavefunctions';
import {getSectorAccountRequests} from '../../config/functions';
import { PersonalLeaveStatus,getLeaveRequests } from '../../config/leavefunctions';

function Home() {
  const [signUpRequests, setsignUpRequests] = useState();

  const [currentUser, setCurrentUser] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState();
  const [PendingLeave, setPendingLeave] = useState();
  const [ApprovedLeave, setApprovedLeave] = useState();
  const [RejectedLeave, setRejectedLeave] = useState();
  const [leaveRequest,setleaveRequests] = useState()

  const isFocused = useIsFocused();
  // const [isLoading,setIsLoading ] = useState(false)

  const navigation = useNavigation('');

  useEffect(() => {
    retrieveUserSession(setCurrentUser);

    const backAction = () => {
      if (navigation.isFocused()) {
        Alert.alert('Hold on!', 'Are you sure you want to Logout?', [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'YES', onPress: () => logoutSesion()},
        ]);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);

  if (currentUser) {
    useEffect(() => {
      getSectorAccountRequests(currentUser, setsignUpRequests);
      //=============leave request
      switch (currentUser.role) {
        case 2:
          getLeaveRequests(currentUser,setleaveRequests,{
            "officeType":"officeId",
            "office":currentUser.office,
            "rank":"CPO",
            "status1":0,
            "status2":0
          })
          break;
          case 3:
            getLeaveRequests(currentUser,setleaveRequests,{
              "officeType":"sector",
              "office":currentUser.sector,
              "rank":"SP"||"SSP",
              "status1":1,
              "status2":1
            })
            break;  
            case 4:
              getLeaveRequests(currentUser,setleaveRequests,{
                "officeType":"sector",
                "office":currentUser.sector,
                "rank":"SP"||"SSP",
                "status1":2,
                "status2":2
              })
              break; 
      
        default:
          break;
      }
 
    }, [currentUser]);
  }



  if (currentUser) {
    useEffect(() => {
      //=======get pending requests
      PersonalLeaveStatus(currentUser, setPendingLeave, {
        id: currentUser.id,
        status1: 0,
        status2: 0,
      });
      //=======get approved requests
      PersonalLeaveStatus(currentUser, setApprovedLeave, {
        id: currentUser.id,
        status1: 3,
        status2: 3,
      });
      //=======get rejected requests
      PersonalLeaveStatus(currentUser, setRejectedLeave, {
        id: currentUser.id,
        status1: 99,
        status2: 99,
      });
    }, [currentUser]);
  }

  // logout clear all sessions

  async function logoutSesion() {
    try {
      await EncryptedStorage.removeItem('currentUser');
      navigation.navigate('Login');
    } catch (error) {}
  }




  return (
    <KeyboardAvoidingView>
 
       <View className="p-2  w-full h-screen relative">
        <View className="  flex  border h-1/6 bg-[#151d4b]   justify-center items-center  w-full rounded-lg   overflow-visible ">
          {currentUser && (
            <View className=" bg-white rounded-xl w-11/12  border-x h-36 shadow-md shadow-black   mt-32 items-center">
              <Text className="text-black font-bold mt-4">
                {currentUser.rank} {currentUser.name} ({currentUser.beltNo})
              </Text>
           

              <TouchableOpacity className=" bg-slate-200 p-2  items-center mt-2 border border-slate-400 shadow-md shadow-black w-4/12 rounded-md">
                <Text className="text-black font-semibold">View Profile</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="mt-10  rounded-m    w-full   justify-evenly flex flex-row ">
          {/* Approved */}

          <TouchableOpacity className="bg-[#217a38]  justify-center  flex-col rounded-md items-center w-3/12 p-1  ">
            <Text className=" text-center  font-bold  text-3xl text-white">
              {ApprovedLeave?ApprovedLeave.length:""}
            </Text>
            <Text className=" text-center font-white  text-sm text-white">
              Approved
            </Text>
          </TouchableOpacity>

          {/* Pending*/}

          <TouchableOpacity className="bg-[#d6a438]  justify-center  flex-col  rounded-md items-center w-3/12 p-1 ">
            <Text className=" text-center  font-bold  text-3xl text-white">
            {PendingLeave?PendingLeave.length:""}
            </Text>
            <Text className=" text-center  font-white  text-sm text-white">
              Pending
            </Text>
          </TouchableOpacity>

          {/* Rejected*/}

          <TouchableOpacity className="bg-[#b63030]  justify-center  flex-col rounded-md items-center w-3/12 p-1">
            <Text className=" text-center  font-bold text-2xl text-white">
            {RejectedLeave?RejectedLeave.length:""}
            </Text>
            <Text className=" text-center  font-white  text-sm text-white">
              Rejected
            </Text>
          </TouchableOpacity>
        </View>

        {/* Leave TABS 1st row*/}
        <View className="rounded-lg  p-4">
          {/* Apply Leave */}
          <View className="flex-row justify-center gap-3">
            <TouchableOpacity
              onPress={() => navigation.navigate('Apply Leave')}
              className="shadow-md shadow-slate-950  w-2/6 flex-row  rounded-md  flex justify-center items-center pt-2 bg-green-600 ">
              <View className=" gap-1 w-full  flex items-center ">
                <View className="bg-white p-2 rounded-full w-8 h-8  ">
                  <BookCopy stroke="green" size={16} strokeWidth={2} />
                </View>
                <View className="flex justify-center items-center flex-row ">
                  {/* <BadgePlus stroke="black" size={20} /> */}
                  <Text className="  font-semibold  text-base text-white">
                    Apply Leave
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/*Add driver  */}
            <TouchableOpacity
              onPress={() => navigation.navigate('UserTabs')}
              className="shadow-md shadow-slate-950  w-4/12 flex-row  rounded-md  flex justify-center  pt-2  bg-indigo-500">
              <View className=" gap-1 w-full items-center flex">
                <View className="bg-white p-2 rounded-full w-8 h-8 ">
                  <Mail stroke="indigo" size={16} strokeWidth={2} />
                </View>
                <View className="flex justify-center items-center flex-row gap-1 ">
                  {/* <BadgePlus stroke="black" size={20} /> */}
                  <Text className=" font-semibold text-base text-white">
                    Leave Status
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Admin dash board */}
        <View className={`rounded-lg p-1 ${currentUser?currentUser.role==1?"hidden":"block":"hidden"}`}>
          <View className="bg-cyan-600 p-2 justify-center items-center ">
            <Text className="text-white">Leave Status of Employees</Text>
          </View>
          {/* Apply Leave */}
          <View className="flex-row justify-center gap-3 mt-2">
            <TouchableOpacity
              onPress={() => navigation.navigate('Leave Requests')}
              className=" relative shadow-md shadow-slate-950  w-2/6 flex-row  rounded-md  flex justify-center items-center pt-2 bg-gray-100 ">
              <View className=" gap-1 w-full  flex items-center ">
                <View className="  p-2 rounded-full w-8 h-8  ">
                  <ArrowDown stroke="green" size={25} strokeWidth={2} />
                </View>
                <View className="flex w-full  justify-center items-center flex-row ">
                  {/* <BadgePlus stroke="black" size={20} /> */}
                  <Text className=" text-black  text-base ">
                    Leave Requests
                  </Text>
                </View>
              </View>
              {leaveRequest &&

                <View className={`bg-red-500 w-5 h-5 rounded-full absolute -right-1 -top-2 shadow-sm shadow-black ${leaveRequest == 0?"hidden":"block"} `}> 
                <Text className='text-center font-extrabold text-white'>{leaveRequest?leaveRequest.length:""}</Text>
              </View>
              }
            </TouchableOpacity>

            {/*Add driver  */}
            <TouchableOpacity
              onPress={() => navigation.navigate('MyTabs')}
              className="shadow-md shadow-slate-950  w-4/12 flex-row  rounded-md  flex justify-center  pt-2  bg-gray-100">
              <View className=" gap-1 w-full items-center flex">
                <View className=" p-2 rounded-full w-8 h-8 ">
                  <BadgeAlert stroke="black" size={25} strokeWidth={2} />
                </View>
                <View className="flex justify-center items-center flex-row gap-1 ">
                  {/* <BadgePlus stroke="black" size={20} /> */}
                  <Text className="  text-base text-black">Status</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {/* ==================Account Aprpoval Requests for Sector OSI=============*/}
        <View
          className={`${
            currentUser
              ? currentUser.role == 3
                ? 'block'
                : 'hidden'
              : 'hidden'
          }  `}>
          <View>
            <TouchableOpacity className="w-full   h-10 rounded-lg  justify-center items-center bg-[#db9335] ">
              <View className="justify-center flex flex-row items-center  w-full gap-2">
                <Text className="  font-white  text-lg text-white">
                  Accounts Approval Requests
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          {signUpRequests && (
            <View className=" bg-gray-100 justify-start items-start w-full">
              <FlatList
                className="p-2 overflow-scroll h-38 w-full"
                data={signUpRequests}
                renderItem={({item, index}) => (
                  <View className="flex   flex-row  items-center">
                    <View className="flex p-2 w-9/12 border-b flex-row align-middle items-start">
                      <Text className="text-black ">{item.rank}</Text>
                      <Text className="text-black ml-2">{item.name}</Text>
                      <Text className="text-black ml-2">({item.beltNo})</Text>
                    </View>

                    <View className="flex p-2 w-4/12 flex-row  items-center">
                      <TouchableOpacity
                        onPress={() =>
                          showModal(item, setModalData, setModalVisible)
                        }
                        className="p-2 bg-green-800 rounded-md justify-between items-center">
                        <Text className="text-white">Verify User</Text>
                      </TouchableOpacity>
                    </View>

                    <ComponentModal
                      data={modalData}
                      auth={currentUser.id}
                      visibility={modalVisible}
                      visibilitySetter={setModalVisible}
                    />
                  </View>
                )}
              />
            </View>
          )}
        </View>

        {/* Update Logout */}

        <View className="m-2 w-full absolute flex items-center justify-center bottom-9">
          <TouchableOpacity
            onPress={() => logoutSesion()}
            className="  h-10 rounded-lg  justify-center items-center w-full bg-[#a32d37] ">
            <View className="justify-center flex flex-row items-center  ">
              <LogOutIcon stroke="white" size={25} strokeWidth={1} />
              <Text className="  font-white  text-lg text-white">Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

export default Home;
