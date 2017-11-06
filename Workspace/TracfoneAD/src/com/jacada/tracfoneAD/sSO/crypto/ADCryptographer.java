package com.jacada.tracfoneAD.sSO.crypto;

import java.io.UnsupportedEncodingException;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.spec.InvalidKeySpecException;
import java.sql.Blob;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.ShortBufferException;
import javax.crypto.spec.SecretKeySpec;



public class ADCryptographer {

	private static final String SALT = "$#@&*?/M";
	

	public static String decrypt(String key, byte[] value)
	 throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException,
	 UnsupportedEncodingException, BadPaddingException, IllegalBlockSizeException,
	 InvalidKeySpecException, ShortBufferException, NoSuchProviderException{
		
		
		
		SecretKey sks = new SecretKeySpec((key+SALT).getBytes(), "AES");
		Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
		cipher.init(Cipher.DECRYPT_MODE, sks);
		byte[] plaintext = new byte[cipher.getOutputSize(value.length)];
		int ptLength = cipher.update(value, 0, value.length, plaintext, 0);
		ptLength += cipher.doFinal(plaintext, ptLength);
		
		int paddingPoint = 0;
		for(int i=0; i < plaintext.length; i++){
			if(plaintext[i] == 0x00){
				paddingPoint = i;
				break;
			}
		}
		
		return (new String(plaintext)).substring(0, paddingPoint);
		
	}

	public static Map<String, String> decrypt(String key, Map<Blob, Blob> value)
	 throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException,
	 UnsupportedEncodingException, BadPaddingException, IllegalBlockSizeException,
	 InvalidKeySpecException, ShortBufferException, NoSuchProviderException, SQLException
	 {
		Map<String, String> dm = new HashMap<String, String>();
		Iterator iter = value.entrySet().iterator();
		while(iter.hasNext()){
			Map.Entry<Blob,Blob> pair = (Map.Entry<Blob,Blob>) iter.next();
			Blob keyBlob = (Blob) pair.getKey();
			Blob valBlob = (Blob) pair.getValue();
			dm.put(
				ADCryptographer.decrypt(
						key, keyBlob.getBytes(1, (int) keyBlob.length())),
				ADCryptographer.decrypt(
						key, valBlob.getBytes(1, (int) valBlob.length()))
			);
		}
		return dm;
	}

	public static byte[] encrypt(String key, String value)
	 throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException,
	 UnsupportedEncodingException, BadPaddingException, IllegalBlockSizeException,
	 InvalidKeySpecException, ShortBufferException, NoSuchProviderException{
		
		byte[] bytes = value.getBytes();
		
		SecretKeySpec sks = new SecretKeySpec((key + SALT).getBytes(), "AES");
		Cipher cipher = Cipher.getInstance("AES/ECB/PKCS5Padding");
		cipher.init(Cipher.ENCRYPT_MODE, sks);
		byte[] encryptedText = new byte[cipher.getOutputSize(bytes.length)];
		int ctLength = cipher.update(bytes, 0, bytes.length, encryptedText, 0);
		ctLength += cipher.doFinal(encryptedText, ctLength);
		
		return encryptedText;
		
		
	}

	public static Map<byte[], byte[]> encrypt(String key, Map<String, String> value)
	 throws NoSuchAlgorithmException, NoSuchPaddingException, InvalidKeyException,
	 UnsupportedEncodingException, BadPaddingException, IllegalBlockSizeException,
	 InvalidKeySpecException, ShortBufferException, NoSuchProviderException{
		Map<byte[], byte[]> dm = new HashMap<byte[], byte[]>();
		Iterator iter = value.entrySet().iterator();
		while(iter.hasNext()){
			Map.Entry pair = (Map.Entry) iter.next();
			dm.put(ADCryptographer.encrypt(key, (String) pair.getKey()), ADCryptographer.encrypt(key, (String) pair.getValue()));
		}
		return dm;
	}

	
	
}
