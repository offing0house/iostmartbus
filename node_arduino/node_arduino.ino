#include<Wire.h>
const int MPU_addr=0x68;
 
int16_t AcX,AcY,AcZ,Tmp,GyX,GyY,GyZ;
int16_t sum = 0;
void init_wire(){
  Wire.begin();
  Wire.beginTransmission(MPU_addr);
  Wire.write(0x6B);  // PWR_MGMT_1 register
  Wire.write(0);     // set to zero (wakes up the MPU-6050)
  Wire.endTransmission(true);
}
 
 
void setup() {
  init_wire();
  Serial.begin(9600);
 

}

void loop() {
      Wire.beginTransmission(MPU_addr);
      Wire.write(0x3B);  // starting with register 0x3B (ACCEL_XOUT_H)
      Wire.endTransmission(false);
      Wire.requestFrom(MPU_addr,14,true);
      
      AcX=Wire.read()<<8|Wire.read();  // 0x3B (ACCEL_XOUT_H) & 0x3C (ACCEL_XOUT_L)    
      AcY=Wire.read()<<8|Wire.read();  // 0x3D (ACCEL_YOUT_H) & 0x3E (ACCEL_YOUT_L)
      AcZ=Wire.read()<<8|Wire.read();  // 0x3F (ACCEL_ZOUT_H) & 0x40 (ACCEL_ZOUT_L)
      Tmp=Wire.read()<<8|Wire.read();  // 0x41 (TEMP_OUT_H) & 0x42 (TEMP_OUT_L)
      GyX=Wire.read()<<8|Wire.read();  // 0x43 (GYRO_XOUT_H) & 0x44 (GYRO_XOUT_L)
      GyY=Wire.read()<<8|Wire.read();  // 0x45 (GYRO_YOUT_H) & 0x46 (GYRO_YOUT_L)
      GyZ=Wire.read()<<8|Wire.read();  // 0x47 (GYRO_ZOUT_H) & 0x48 (GYRO_ZOUT_L)
      Tmp = Tmp/340.00+36.53;


    

    if(((sum - 500 > AcX + AcY + AcZ + GyX + GyY + GyZ) || (sum + 500 < AcX + AcY + AcZ + GyX + GyY + GyZ)))
    {
        Serial.print(F("{\"AcX\": "));
        Serial.print(AcX);
        Serial.print(F(", \"AcY\": "));
        Serial.print(AcY);
        Serial.print(F(", \"AcZ\": "));
        Serial.print(AcZ);
        Serial.print(F(", \"GyX\": "));
        Serial.print(GyX);
        Serial.print(F(", \"GyY\": "));
        Serial.print(GyY);
        Serial.print(F(", \"GyZ\": "));
        Serial.print(GyZ);
        Serial.println(F("}"));
    }

  
    
    sum = AcX + AcY + AcZ + GyX + GyY + GyZ;
    
//      Serial.print(AcX);
//      Serial.print(AcY);
//      Serial.print(AcZ);
//
//      Serial.print(GyX);
//      Serial.print(GyY);
//      Serial.print(GyZ);
      
      delay(5000);
  
}
