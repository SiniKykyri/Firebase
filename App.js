import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, Button, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react'
import {firestore, collection,addDoc,MESSAGES,serverTimestamp,query, onSnapshot, doc, orderBy} from './firebase/Config'
import  Constants from 'expo-constants';
import { convertFirebaseTimeStampToJS } from './helpers/Functions';



export default function App() {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    const q = query(collection(firestore, MESSAGES), orderBy('created', 'desc'))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const tempMessages = []

      querySnapshot.forEach((doc) => {
        // Create and format message object based on data retrieved from database
        const messageObject = {
          id:doc.id,
          text: doc.data().text,
          created: convertFirebaseTimeStampToJS(doc.data().created)
        }
        
        tempMessages.push(messageObject)
      })
      setMessages(tempMessages)
    })
    return () => {
      unsubscribe()
    }
  }, [])

  const save = async () => {
    const docRef = await addDoc(collection(firestore, MESSAGES), {
      text: newMessage,
      created: serverTimestamp()
    }).catch (error =>console.loh(error))
    setNewMessage('')
    console.log('Message saved')
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.messageContainer}>
        <Text style = {styles.title}>Messages</Text>
        <ScrollView>
          {
            messages.map((message) => (
              <View style = {styles.message} key={message.id}>
                <Text style = {styles.messageInfo}>{message.created}</Text>
                <Text>{message.text}</Text>
              </View>
            ))
          }
        </ScrollView>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.title}>Send a message</Text>
        <TextInput style={styles.input} placeholder='Send Message...' value={newMessage} onChangeText={text=>setNewMessage(text)} />
        <Button title='Send' type='button' onPress={save} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    flex: 1,
    backgroundColor:'#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center'
  },
  messageContainer: {
    flex: 1,
    maxHeight: '65%',
    backgroundColor: '#fff',
  },
  message: {
    padding: 10,
    marginTop: 10, 
    marginBottom: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 2,
    borderRadius: 5,
    marginLeft: 10,
    marginRight: 10

  },
  messageInfo: {
    color: '#666',
    fontSize: 12,
    marginBottom: 5
  },
  inputContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 4,
    backgroundColor: '#fff',
    maxHeight: '25%',
    height: '25%',
  },
  input: {
    flex: 1,
    marginBottom:10,
    marginTop: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    width: '90%',
    fontSize: 16
  },
});
