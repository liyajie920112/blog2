---
title: Android获取位置信息
tags:
  - android
---

> Android中获取位置信息我们可以借助`LocationManager`来获取

Google提供的最新方法可以参考这里
- [https://developer.android.com/training/location/retrieve-current](https://developer.android.com/training/location/retrieve-current)

Medium参考
- [https://droidbyme.medium.com/get-current-location-using-fusedlocationproviderclient-in-android-cb7ebf5ab88e](https://droidbyme.medium.com/get-current-location-using-fusedlocationproviderclient-in-android-cb7ebf5ab88e)

<!-- more -->

## 位置信息工具类

```java
// LocationUtils.java工具类

public class LocationUtils {

  private Context mContext;
  private LocationManager locationManager;
  private OnLocationResultListener mOnLocationListener;

  private LocationUtils(Context context) {
    this.mContext = context;
  }

  public static LocationUtils getInstance(Context context) {
    if (instance == null) {
        instance = new LocationUtils(context);
    }
    return instance;
  }

  public String getLngLat(OnLocationResultListener onLocationResultListener) {
    mOnLocationListener = onLocationResultListener;
    // 根据定位服务获取locationManager
    locationManager = (LocationManager) mContext.getSystemService(Context.LOCATION_SERVICE);
    //获取所有可用的位置提供器
    List<String> providers = locationManager.getProviders(true);
    // 判断是否开启了GPS
    if (providers.contains(LocationManager.GPS_PROVIDER)) {
      //如果是GPS
      locationProvider = LocationManager.GPS_PROVIDER;
    } else {
      // 如果没有开启定位功能, 跳转到开启定位的页面
      SystemUtils.IsToSet((Activity) mContext, Settings.ACTION_LOCATION_SOURCE_SETTINGS, "定位未开启", "您的定位服务未打开, 无法使用该功能, 请先打开您的定位", false);
      return null;
    }
    if (ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
      // 如果没有开启权限, 则跳转到开启权限页面
      SystemUtils.IsToSet((Activity) mContext, "", "位置权限未开启", "您的位置权限未打开, 无法使用该功能, 请先授权", true);
      return null;
    }

    // locationManager.getLastKnownLocation该方法需要检查权限是否开启后才能使用
    // Call requires permission which may be rejected by user: code should explicitly check to see if permission is available (with checkPermission) or explicitly handle a potential SecurityException
    // 获取位置信息
    Location location = locationManager.getLastKnownLocation(locationProvider);
    // location如果没有更新过位置信息可能或返回null, 所以我们需要请求位置更新
    if (mOnLocationListener != null) {
      // 执行回调
      mOnLocationListener.onLocationResult(location);
    }
    //监视地理位置变化, 5s更新一次, 最小距离为1m
    locationManager.requestLocationUpdates(locationProvider, 5000, 1, locationListener);
    return "";
  }

  public LocationListener locationListener = new LocationListener() {

        // Provider的状态在可用、暂时不可用和无服务三个状态直接切换时触发此函数
        @Override
        public void onStatusChanged(String provider, int status, Bundle extras) {

        }

        // Provider被enable时触发此函数，比如GPS被打开
        @Override
        public void onProviderEnabled(String provider) {
            if (provider == LocationManager.GPS_PROVIDER) {
                //监视地理位置变化
                if (ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(mContext, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
                    return;
                }
                locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 5000, 1, locationListener);
            }
        }

        // Provider被disable时触发此函数，比如GPS被关闭
        @Override
        public void onProviderDisabled(String provider) {
            if (provider == LocationManager.GPS_PROVIDER) {
                removeListener();
            }
        }

        //当坐标改变时触发此函数，如果Provider传进相同的坐标，它就不会被触发
        @Override
        public void onLocationChanged(Location location) {
            if (mOnLocationListener != null) {
                mOnLocationListener.OnLocationChange(location);
            }
        }
    };

  // 移除监听
  public void removeListener() {
    locationManager.removeUpdates(locationListener);
  }

  // 位置回调
  public interface OnLocationResultListener {
    void onLocationResult(Location location);
    void OnLocationChange(Location location);
  }
}
```

## 使用

```java
public void getLocation() {
  getLocationUtils().getLngAndLat(new LocationUtils.OnLocationResultListener() {
    @Override
    public void onLocationResult(Location location) {
      if (location == null) {
          // 没有获取到位置信息
          return;
      }
      double lat = location.getLatitude();
      double lon = location.getLongitude();
      String locationStr = lon + "," + lat;
      String timestamp = System.currentTimeMillis() + "";
      // 获取到位置信息后
      Log.d(TAG, "location: " + locationStr + "-" + System.currentTimeMillis());
    }

    @Override
    public void OnLocationChange(Location location) {
      Log.d(TAG, "OnLocationChange: " + location.getLongitude() + "-" + System.currentTimeMillis());
    }
  });
}
```