import { IPost, IUser, SocialProvider } from '@/types/firebase';
import { FirebaseError, initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  EmailAuthProvider,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  updateProfile,
  deleteUser,
  reauthenticateWithCredential,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  deleteDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
} from 'firebase/firestore';
import toastr from 'toastr';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
const database = getFirestore(app);
const postsCollectionRef = collection(database, 'posts');

export const socialLogin =
  (type: SocialProvider) => async (): Promise<User | null> => {
    try {
      let provider = null;
      if (type === 'google') {
        provider = new GoogleAuthProvider();
      } else if (type === 'github') {
        provider = new GithubAuthProvider();
      } else if (type === 'facebook') {
        provider = new FacebookAuthProvider();
      }

      if (!provider) {
        toastr.error('지원되지 않는 소셜 로그인 제공자입니다.');
        return null;
      }

      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      if (user) {
        const userDocRef = doc(database, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (!userDocSnap.exists()) {
          await setDoc(userDocRef, {
            email: user.email,
            displayName: user.displayName || null,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString(),
          });
        } else {
          await setDoc(
            userDocRef,
            { lastLogin: new Date().toISOString() },
            { merge: true }
          );
        }
      }

      return user;
    } catch (error) {
      // throw error;
      const fbError = error as FirebaseError;
      switch (fbError.code) {
        case 'auth/popup-closed-by-user':
          toastr.error('로그인 팝업이 닫혔습니다. 다시 시도해주세요.');
          break;
        case 'auth/cancelled-popup-request':
          toastr.error(
            '이전 팝업이 닫히기 전에 새 팝업 요청이 취소되었습니다.'
          );
          break;
        case 'auth/account-exists-with-different-credential':
          toastr.error(
            '이미 다른 인증 제공자로 가입된 이메일입니다. 기존 인증 제공자로 로그인해주세요.'
          );
          break;
        case 'auth/operation-not-allowed':
          toastr.error('현재 이 소셜 로그인 제공자가 비활성화되어 있습니다.');
          break;
        case 'auth/network-request-failed':
          toastr.error(
            '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
          );
          break;
        case 'auth/internal-error':
          toastr.error(
            '내부 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          );
          break;
        default:
          toastr.error('알 수 없는 오류가 발생했습니다.', fbError.message);
          break;
      }
    }
  };

export const login = async (
  email: string,
  password: string
): Promise<User | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = result.user;

    if (user) {
      const userDocRef = doc(database, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (!userDocSnap.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          displayName: user.displayName || null,
          lastLogin: new Date().toISOString(),
        });
      } else {
        await setDoc(
          userDocRef,
          {
            lastLogin: new Date().toISOString(),
          },
          { merge: true }
        );
      }
    }

    return user;
  } catch (error) {
    // throw error;
    const fbError = error as FirebaseError;
    switch (fbError.code) {
      case 'auth/invalid-email':
        toastr.error('유효하지 않은 이메일입니다.');
        break;
      case 'auth/user-disabled':
        toastr.error('비활성화된 계정입니다. 관리자에게 문의하세요.');
        break;
      case 'auth/user-not-found':
        toastr.error('존재하지 않는 사용자입니다. 이메일을 확인해주세요.');
        break;
      case 'auth/missing-password':
        toastr.error('잘못된 비밀번호입니다.');
        break;
      case 'auth/invalid-credential':
        toastr.error('유효하지 않은 계정입니다.');
        break;
      case 'auth/network-request-failed':
        toastr.error(
          '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
        );
        break;
      case 'auth/too-many-requests':
        toastr.error('요청이 너무 많습니다. 잠시 후 다시 시도해주세요.');
        break;
      default:
        toastr.error('알 수 없는 오류가 발생했습니다.', fbError.message);
        break;
    }
    return null; // 에러 발생 시 null 반환
  }
};

export const signup = async (
  email: string,
  password: string,
  nickname?: string
): Promise<User | null> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = result.user;

    if (nickname && user) {
      await updateProfile(user, { displayName: nickname });
    }

    toastr.success('계정 생성이 완료 되었습니다.');

    await setDoc(doc(database, 'users', user.uid), {
      email: user.email,
      displayName: nickname || null,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    });

    return user;
  } catch (error) {
    // throw error;
    const fbError = error as FirebaseError;
    switch (fbError.code) {
      case 'auth/email-already-in-use':
        toastr.error('이미 사용 중인 이메일입니다.');
        break;
      case 'auth/invalid-email':
        toastr.error('유효하지 않은 이메일입니다.');
        break;
      case 'auth/weak-password':
        toastr.error('비밀번호가 너무 약합니다. 6자 이상 입력해주세요.');
        break;
      case 'auth/operation-not-allowed':
        toastr.error('현재 이메일/비밀번호로 회원가입이 비활성화되었습니다.');
        break;
      case 'auth/network-request-failed':
        toastr.error(
          '네트워크 오류가 발생했습니다. 인터넷 연결을 확인해주세요.'
        );
        break;
      default:
        toastr.error('알 수 없는 오류가 발생했습니다.', fbError.message);
        break;
    }
    return null; // 에러 발생 시 null 반환
  }
};

export async function logout(): Promise<void> {
  try {
    const user = auth.currentUser;
    if (user) {
      const sessionRef = doc(database, 'sessions', user.uid);
      await deleteDoc(sessionRef);
    }

    await signOut(auth);
  } catch (error) {
    console.error('로그아웃 에러 : ', error);
    throw error;
  }
}

async function getUserDataFromFirestore(uid: string) {
  const userDocRef = doc(database, 'users', uid);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return { uid, ...userDocSnap.data() };
  } else {
    return null;
  }
}

export function onUserStateChange(callback: (user: User | null) => void): void {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const userData = await getUserDataFromFirestore(user.uid);
      callback(userData ? { ...user, ...userData } : user);
    } else {
      callback(null);
    }
  });
}

export function fetchUser(): Promise<User | null> {
  return new Promise((resolve) => {
    onUserStateChange((user) => resolve(user));
  });
}

export async function removeUser(
  email?: string,
  password?: string
): Promise<void | FirebaseError | boolean> {
  try {
    const user = auth.currentUser;

    if (!user) {
      toastr.error('사용자 정보가 없습니다. 다시 로그인해주세요.');
      return;
    }

    if (user.providerData[0].providerId === 'password') {
      const credential = EmailAuthProvider.credential(email, password);

      try {
        await reauthenticateWithCredential(user, credential);
      } catch (error) {
        const fbError = error as FirebaseError;

        // 인증 오류 처리
        if (fbError.code === 'auth/requires-recent-login') {
          toastr.error('회원 탈퇴를 위해 다시 로그인해주세요.');
        } else if (
          fbError.code === 'auth/missing-password' ||
          fbError.code === 'auth/wrong-password' ||
          fbError.code === 'auth/invalid-credential'
        ) {
          toastr.error('비밀번호가 일치하지 않습니다.');
        } else {
          toastr.error(
            '인증 중 오류가 발생했습니다. 다시 시도해주세요.',
            fbError.code
          );
        }
        return fbError; // 인증 실패 시 처리 종료
      }
    }

    const userDocRef = doc(database, 'users', user.uid);
    await deleteDoc(userDocRef);

    await deleteUser(auth.currentUser);
    toastr.success('회원 탈퇴가 완료되었습니다.');

    return true;
  } catch (error) {
    const fbError = error as FirebaseError;
    console.error('회원 탈퇴 중 오류 발생 : ', fbError);

    if (fbError.code === 'auth/requires-recent-login') {
      toastr.error('회원 탈퇴를 위해 다시 로그인해주세요.');
    } else {
      toastr.error('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
    }

    return fbError;
  }
}

export async function getUsers(): Promise<IUser[]> {
  const usersCollectionRef = collection(database, 'users');
  const usersSnapshot = await getDocs(usersCollectionRef);

  const users = usersSnapshot.docs.map((doc) => {
    const data = doc.data();

    return {
      id: doc.id,
      // ...doc.data(),
      email: data.email || '',
      createdAt: data.createdAt || null,
      displayName: data.displayName || null,
      lastLogin: data.lastLogin || null,
    };
  });

  return users;
}

// export async function getUser(userId: string) {
export const getUser = (userId: string) => async () => {
  try {
    const userDocRef = doc(database, 'users', userId);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      // console.log('Document data:', userDocSnap.data());
      return userDocSnap.data();
    } else {
      toastr.error('해당 데이터를 찾을 수 없습니다.');
      return null;
    }
  } catch (error) {
    console.error('getUsers Error : ', error);
    throw error;
  }
};

// 게시글 추가
export const addPost = async (title: string, content: string) => {
  const user = auth.currentUser;

  return await addDoc(postsCollectionRef, {
    title,
    content,
    createdAt: new Date(),
    ...(user && { author: user.uid }), // user가 있으면 author 필드 추가
  });
};

// 게시글 조회
export const getPosts = async () => {
  const q = query(postsCollectionRef, orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// 게시글 보기
export const getPostById = async (postId): Promise<IPost> => {
  const postRef = doc(database, 'posts', postId);
  const postSnap = await getDoc(postRef);
  if (postSnap.exists()) {
    return { id: postSnap.id, ...postSnap.data() } as IPost;
  } else {
    throw new Error('글을 찾을 수 없습니다.');
  }
};

// 게시글 수정
export const updatePost = async (
  id: string,
  title: string,
  content: string
) => {
  const postRef = doc(database, 'posts', id);
  return await updateDoc(postRef, { title, content });
};

// 게시글 삭제
export const deletePost = async (id: string) => {
  const postRef = doc(database, 'posts', id);
  return await deleteDoc(postRef);
};
