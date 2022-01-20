# 네이티브 모듈 만들기
## 안드로이드 모듈 만들기
### 모듈 만들기
먼저 npx react-native init [프로젝트명] 만든 프로젝트의 `android` 디렉토리를 안드로이드 스튜디오로 연다

`/java/com/nativemoduleworkshop/ToastModule.java`
```java
package com.nativemoduleworkshop;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod

public class ToastModule extends ReactContextBaseJavaModule {
    ToastModule(ReactApplicationContext context) {
        super(context);
    }

    @Override
    public String getName() {
        return "ToastModule";
    }
}
``` 

`getName` 메소드의 리턴값은 네이티브 모듈의 이름이고, 나중에 자바스크립트 코드에서 모듈을 불러오는 과정에서 사용된다

```java
@ReactMethod
public void show(String message, int duration) {
    ReactApplicationContext context = getReactApplicationContext();
    Toast toast = Toast.makeText(context, message, duration);
    toast.show();
}
```

show 메소드를 만들고 자바스크립트 쪽에서 불러와서 사용할 수 있다

```js
import { NativeModules } from 'react-native'
import { ToastModule } = NativeModules;
ToastModule.show('Hello World', 1)
```

자바에서 상수를 선언하고 자바스크립트에서 가져오게 하려면 getConstanst 메소드를 오버라이드하여 만든뒤 상수들을 지닌 Map을 반환해준다
```java
import java.util.HashMap;
import java.util.Map;

@Override
public Map<String, Object> getConstants() {
    final Map<String, Object> constants = new HashMap<>();
    constants.put("SHORT", Toast.LENGTH_SHORT);
    constants.put("LONG", Toast.LENGTH_LONG);
    return constants;
}
```

자바스크립트에서 다음과 같이 상수를 사용할수 있다

```js
import { NativeModules } from 'react-native'
import { ToastModule } = NativeModules;
ToastModule.show('Hello World', ToastModule.LONG) 
```

### 패키지 만들기
만든 모듈을 리액트 네이티브 프로젝트에서 사용하려면 패키지를 만들어서 등록해야 한다
`/java/com/nativemoduleworkshop/ToastPackage.java`
```java
package com.nativemoduleworkshop;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class ToastPackage implements ReactPackage {
    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new ToastModule(reactContext));
        return modules;
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }
}
```
패키지를 만들때는 `createNativeModules`와 `createViewManagers`메서드를 구현해야 한다
- `createViewManagers`: ui컴포넌트를 만들어서 등록할때 사용
- `createNativeModules`: 만든 자바 모듈을 ArrayList에 담고 반환한다

`/java/com/nativemoduleworkshop/MainApplication.java`
```java
@Override
protected List<ReactPackage> getPackages() {
  @SuppressWarnings("UnnecessaryLocalVariable")
  List<ReactPackage> packages = new PackageList(this).getPackages();
  packages.add(new ToastPackage());
  return packages;
}
```

`packages.add(new ToastPackage());`코드를 추가하여 수동으로 만든 패키지를 추가한다

### 자바스크립트에서 네이티브 모듈 가져오기
`Toast.js`
```js
import {NativeModules} from 'react-native';

const {ToastModule} = NativeModules;

export default ToastModule;
```

`App.js`
```js
import React from 'react';
import type {Node} from 'react';
import {Button, SafeAreaView} from 'react-native';

import ToastModule from './Toast';

const App: () => Node = () => {
  const onPress = () => {
    ToastModule.show('Hello World', ToastModule.SHORT);
  };

  return (
    <SafeAreaView>
      <Button title="Press me" onPress={onPress} />
    </SafeAreaView>
  );
};

export default App;
```

1. 임의의 `Toast.js`파일을 만들고 네이티브 모듈에서 ToastModule을 가져온 뒤 export 해준다
2. `App.js`파일에서 가져와 ToastModule에서 구현했던 show 메소드가 잘 실행되는것을 확인할 수 있다

## IOS 모듈 만들기
### 모듈 만들기
IOS에서는 안드로이드의 Toast처럼 내장되어있는 Alert을 직접 구현한다

`RCTAlertModule.h`
```h
#import <React/RCTBridgeModule.h>
@interface RCTAlertModule : NSObject <RCTBridgeModule>
@end
```

`RCTAlertModule.m`
```h
#import "RCTAlertModule.h"

@implementation RCTAlertModule

RCT_EXPORT_MODULE()

@end
```

`RCT_EXPORT_MODULE()`는 모듈을 내보내는 역할을 한다 이름은 `RCTAlertModule`의 RCT 를 제외한 이름이 되고 이름을 지정하고 싶을 경우 인자에 넣어준다ㅣ

최종본
`RCTAlertModule.m`
```m
#import "RCTAlertModule.h"

@implementation RCTAlertModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(alert:(NSString *)message)
{
  UIAlertController* alert = [UIAlertController alertControllerWithTitle:@"My Alert"
  message:message
  preferredStyle:UIAlertControllerStyleAlert];

  UIAlertAction* defaultAction = [UIAlertAction actionWithTitle:@"OK" style:UIAlertActionStyleDefault
                                 handler:^(UIAlertAction * action) {}];
  
  [alert addAction:defaultAction];
  
  UIViewController *rootViewController = [UIApplication sharedApplication].delegate.window.rootViewController;
  
  dispatch_async(dispatch_get_main_queue(), ^{
      [rootViewController presentViewController:alert animated:YES completion:nil];
  });
}


- (NSDictionary *)constantsToExport
{
 return @{
   @"STRING_VALUE": @"Hello World",
   @"NUMBER_VALUE": @(15)
 };
}


+ (BOOL)requiresMainQueueSetup
{
    return YES;
}


@end
```

- IOS에서는 UI 관련 작업은 main 스레드에서 실행하기 때문에 `dispatch_async`와 `dispatch_get_main_queue`를 사용한다
- 상수를 내보내려면 `constantsToExport`메서드를 오버라이딩 한다

### 자바스크립트에서 네이티브 모듈 가져오기
`Alert.js`
```js
import {NativeModules} from 'react-native';

const {AlertModule} = NativeModules;

export default AlertModule;
```

```js
import Alert from './Alert';

const onPress = () => {
  Alert.alert('Hello DongJu');
  console.log({
    string: Alert.STRING_VALUE,
    number: Alert.NUMBER_VALUE,
  });
};
```

1. 임의의 `Alert.js`파일을 만들고 네이티브 모듈에서 AlertModule을 가져온 뒤 export 해준다
2. `App.js`파일에서 가져와 AlertModule에서 구현했던 alert 메소드가 잘 실행되는것을 확인할 수 있다
