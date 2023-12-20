import React, {useEffect, useState, useCallback} from 'react';
import {Modal, View, Text, TouchableOpacity} from 'react-native';

function ComponentModal(props) {
  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={props.visibility}
        onRequestClose={() => {
          props.visibilitySetter(!props.visibility);
        }}>
        <View className="bg-[#d9d0f35e]  h-full w-full justify-center items-center flex">
          {props.data && (
            <View className=" w-11/12  bg-white border shadow  rounded-lg justify- items-start px-2 align-middle shadow-black ">
              <Text className="text-black text-lg p-4">
                {' '}
                Please Verify credentials of Employee{' '}
              </Text>
              <Text>CNIC: {props.data.id}</Text>
              <Text>Name: {props.data.name}</Text>
              <Text>Rank: {props.data.rank}</Text>
              <Text>Belt No.{props.data.beltNo}</Text>
              <Text>Beat:{props.data.beat}</Text>
              <Text>Sector:{props.data.sector}</Text>
              <Text>Zone:{props.data.zone}</Text>

              <View className=" flex flex-row gap-2 p-4 mt-5 ">
                <TouchableOpacity
                  onPress={() => props.visibilitySetter(!props.visibility)}
                  className="bg-red-600 p-2 rounded-md w-32 justify-center items-center">
                  <Text className="text-white">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  // onPress={()=>verifyUser()}
                  className="bg-green-600 p-2 rounded-md w-32 justify-center items-center">
                  <Text className="text-white">Confirm</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
}

export default ComponentModal;
