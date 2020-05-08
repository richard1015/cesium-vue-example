<template>
  <div class="CesiumViewer">
    <div id="cesiumContainer"></div>
    <el-button class="printer-btn" @click="print" type="primary" icon="el-icon-printer">print</el-button>

    <el-dialog title="print setting" :visible.sync="dialogFormVisible" width="40%">
      <el-form :model="form">
        <el-form-item label="print title" :label-width="formLabelWidth">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="title font size preview" :label-width="formLabelWidth">
          <el-input :disabled="true" v-bind:style="{fontSize:form.fontSize}" v-model="form.title" autocomplete="off">
          </el-input>
        </el-form-item>
        <el-form-item label="title font size" :label-width="formLabelWidth">
          <el-select style="width:100%" v-model="form.fontSize" placeholder="font size">
            <el-option label="h1" value="32"></el-option>
            <el-option label="h2" value="24"></el-option>
            <el-option label="h3" value="18.72"></el-option>
            <el-option label="h4" value="16"></el-option>
            <el-option label="h5" value="13.28"></el-option>
            <el-option label="h6" value="12"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="print width" :label-width="formLabelWidth">
          <el-input placeholder="unit px" v-model="form.width"></el-input>
        </el-form-item>
        <el-form-item label="print height" :label-width="formLabelWidth">
          <el-input placeholder="unit px" v-model="form.height"></el-input>
        </el-form-item>
        <el-form-item label="download print file" :label-width="formLabelWidth">
          <el-switch style="float: left;" v-model="form.downLoadEnable"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">cancel</el-button>
        <el-button type="primary" @click="printSetting">ok</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script type="text/javascript">
import {
  Cesium3DTileset,
  EllipsoidTerrainProvider,
  createWorldTerrain,
  IonResource,
  Viewer,
  Clock,
  WebMapTileServiceImageryProvider,
  createDefaultImageryProviderViewModels,
  Cartesian3,
  Rectangle,
  UrlTemplateImageryProvider,
  ArcGisMapServerImageryProvider,
  BingMapsImageryProvider,
  BingMapsStyle
} from "cesium";
import "cesium/Build/Cesium/Widgets/widgets.css";
//指北针插件
import CesiumNavigation from "cesium-navigation-es6";
//打印插件
import CesiumPrint from "cesium-print";
let self, viewer;
export default {
  name: "cesiumViewer",
  data() {
    return {
      formLabelWidth: "120px",
      dialogFormVisible: false,
      form: {
        fontSize: "32",
        width: "978",
        height: "650",
        downLoadEnable: true //是否下载打印文件
      }
    };
  },
  mounted() {
    self = this;
    self.$notify({
      title: "",
      message: " cesium plugin demo ！",
      type: "success"
    });
    self.init();
  },
  methods: {
    init() {
      viewer = new Viewer("cesiumContainer", {
        animation: false, //是否创建动画小器件，左下角仪表
        baseLayerPicker: false, //是否显示图层选择器
        fullscreenButton: true, //是否显示全屏按钮
        geocoder: true, //是否显示geocoder小器件，右上角查询按钮
        homeButton: false, //是否显示Home按钮
        infoBox: false, //是否显示信息框
        sceneModePicker: false, //是否显示3D/2D选择器
        selectionIndicator: false, //是否显示选取指示器组件
        timeline: false, //是否显示时间轴
        navigationHelpButton: false, //是否显示右上角的帮助按钮
        scene3DOnly: true, //如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
        clock: new Clock(), //用于控制当前时间的时钟对象
        selectedImageryProviderViewModel: undefined, //当前图像图层的显示模型，仅baseLayerPicker设为true有意义
        // imageryProviderViewModels: createDefaultImageryProviderViewModels(), //可供BaseLayerPicker选择的图像图层ProviderViewModel数组
        selectedTerrainProviderViewModel: undefined, //当前地形图层的显示模型，仅baseLayerPicker设为true有意义
        // terrainProviderViewModels: createDefaultTerrainProviderViewModels(), //可供BaseLayerPicker选择的地形图层ProviderViewModel数组
        terrainProvider: new EllipsoidTerrainProvider(), //地形图层提供者，仅baseLayerPicker设为false有意义
        // skyBox: new Cesium.SkyBox({
        //   sources: {
        //     positiveX: "Cesium-1.7.1/Skybox/px.jpg",
        //     negativeX: "Cesium-1.7.1/Skybox/mx.jpg",
        //     positiveY: "Cesium-1.7.1/Skybox/py.jpg",
        //     negativeY: "Cesium-1.7.1/Skybox/my.jpg",
        //     positiveZ: "Cesium-1.7.1/Skybox/pz.jpg",
        //     negativeZ: "Cesium-1.7.1/Skybox/mz.jpg"
        //   }
        // }), //用于渲染星空的SkyBox对象
        // fullscreenElement: document.body, //全屏时渲染的HTML元素,
        // useDefaultRenderLoop: true, //如果需要控制渲染循环，则设为true
        // targetFrameRate: undefined, //使用默认render loop时的帧率
        // showRenderLoopErrors: false, //如果设为true，将在一个HTML面板中显示错误信息
        // automaticallyTrackDataSourceClocks: true, //自动追踪最近添加的数据源的时钟设置
        contextOptions: {
          id: "cesiumCanvas",
          webgl: {
            preserveDrawingBuffer: true
          }
        } //传递给Scene对象的上下文参数（scene.options）
        // sceneMode: Cesium.SceneMode.SCENE3D, //初始场景模式
        // mapProjection: new Cesium.WebMercatorProjection(), //地图投影体系
        // dataSources: new Cesium.DataSourceCollection()
        //需要进行可视化的数据源的集合
      });
      //使用太阳作为光源，可以照亮地球。
      viewer.scene.globe.enableLighting = false;
      //关闭地面大气效果，（默认为开启状态）
      viewer.scene.globe.showGroundAtmosphere = false;
      //FPS 帧率显示
      viewer.scene.debugShowFramesPerSecond = true;
      //cesiumCanvas id 设置
      viewer.scene.canvas.id = "cesiumCanvas";
      self.flytochina();
      //指北针插件
      self.initNavigation();
      //初始地图高清
      self.changeBaseMap("gg");
    },
    printSetting() {
      if (!this.form.title) {
        this.$message({
          message: "请填写标题",
          type: "warning"
        });
        return;
      }
      if (!this.form.fontSize) {
        this.$message({
          message: "请选择字体",
          type: "warning"
        });
        return;
      }
      if (!this.form.width && this.form.height) {
        this.$message({
          message: "请设置宽高（单位px）",
          type: "warning"
        });
        return;
      }
      this.dialogFormVisible = false;
      this.resolve(this.form);
    },
    //打印事件
    print() {
      const self = this;
      self.$notify({
        title: "",
        message:
          "现在你可以使用鼠标拖拽选取打印区域，松开后开始打印！Now you can use the mouse to drag and drop to select the print area, release it and start printing!",
        type: "success"
      });
      let _confirmPromise = function() {
        return new Promise((resolve, reject) => {
          self.dialogFormVisible = true;
          self.resolve = resolve;
        });
      };
      //打印cesium canvas dom
      CesiumPrint.drawArea("cesiumCanvas", {
        penColor: "yellow", //画笔颜色
        strokeWidth: 1 //单位 px
      })
        .then(base64url => {
          //自定义打印（设置纸张大小，打印标题）

          //     高       宽
          // A0：1189mm * 841mm
          // A1：841mm * 594mm
          // A2：594mm * 420mm
          // A3：420mm * 297mm
          // A4：297mm * 210mm

          //  页边距： 0.75 inch

          // A1: 23.39x33.11 inch
          // 打印机DPI：300DPI
          // 屏幕DPI  : 96DPI
          // width　=　(23.39 - 0.75 * 2) * 96  = 2101 px
          // height =  (33.11 - 0.75 * 2)* 96  = 3034 px

          // A4: 8.27x11.69 inch
          // 打印机DPI：300DPI
          // 屏幕DPI  : 96DPI
          // width　=　(8.27 - 0.75 * 2) * 96  = 650 px
          // height =  (11.69 - 0.75 * 2)* 96  = 978 px

          // 所以，当<table> 的width=650px, height=978px时，用IE 打印时，刚好能打印一页的A4纸．

          // //a1横向打印尺寸
          // var a1 = { width: "3034", height: "2101" };
          // //a4横向打印尺寸
          // var a4 = { width: "978", height: "650" };
          _confirmPromise().then(options => {
            // let printOptions = {
            //   title: "打印标题(print title)",
            //   width: a4.width,
            //   height: a4.height,
            //   fontSize: "30",
            //   downLoadEnable: true //是否下载打印文件
            // };
            CesiumPrint.print(base64url, options);
          });
        })
        .catch(error => {
          console.error(error);
        });
    },
    //初始化指北针
    initNavigation() {
      var options = {};
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Rectangle.fromDegrees(80, 22, 130, 50);
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass = true;
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls = true;
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend = true;
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing = true;
      CesiumNavigation(viewer, options);
    },
    /** 中国坐标 */
    getChinaPostion() {
      return Cartesian3.fromDegrees(116.435314, 40.960521, 10000000.0);
    },
    /**
     *  初始定位中国
     * */
    flytochina() {
      viewer.camera.flyTo({
        destination: self.getChinaPostion(),
        duration: 8
      });
    },
    /**
     * 切换地图
     */
    changeBaseMap(type) {
      viewer.imageryLayers.removeAll();
      switch (type) {
        //天地图
        case "tdt":
          viewer.imageryLayers.addImageryProvider(
            new WebMapTileServiceImageryProvider({
              url:
                "http://t0.tianditu.com/img_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=img&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=93d1fdef41f93d2211deed6d22780c48",
              layer: "tdtBasicLayer",
              style: "default",
              format: "image/jpeg",
              tileMatrixSetID: "GoogleMapsCompatible",
              show: false,
              maximumLevel: 16
            })
          );
          break;
        //天地图矢量
        case "tdtsl":
          viewer.imageryLayers.addImageryProvider(
            new WebMapTileServiceImageryProvider({
              url:
                "http://t0.tianditu.com/vec_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=vec&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk=93d1fdef41f93d2211deed6d22780c48",
              layer: "tdtVecBasicLayer",
              style: "default",
              format: "image/jpeg",
              tileMatrixSetID: "GoogleMapsCompatible",
              show: false
            })
          );
          break;
        //谷歌影像
        case "gg":
          var url =
            "http://mt1.google.cn/vt/lyrs=s&hl=zh-CN&x={x}&y={y}&z={z}&s=Gali";
          viewer.imageryLayers.addImageryProvider(
            new UrlTemplateImageryProvider({ url: url })
          );
          break;
        case "arcgis":
          viewer.imageryLayers.addImageryProvider(
            new ArcGisMapServerImageryProvider({
              url:
                "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",
              enablePickFeatures: false
            })
          );
          break;
        //必应
        case "bing":
          viewer.imageryLayers.addImageryProvider(
            new BingMapsImageryProvider({
              url: "https://dev.virtualearth.net",
              key: "get-yours-at-https://www.bingmapsportal.com/",
              mapStyle: BingMapsStyle.AERIAL
            })
          );
          break;
        case "dark":
          viewer.imageryLayers.addImageryProvider(
            new createTileMapServiceImageryProvider({
              url: "https://cesiumjs.org/blackmarble",
              credit: "Black Marble imagery courtesy NASA Earth Observatory",
              flipXY: true // Only old gdal2tile.py generated tilesets need this flag.
            })
          );
          break;
      }

      //全球影像中文注记服务
      viewer.imageryLayers.addImageryProvider(
        new WebMapTileServiceImageryProvider({
          url:
            "http://t0.tianditu.com/cia_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=93d1fdef41f93d2211deed6d22780c48",
          layer: "tdtAnnoLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible",
          show: false
        })
      );
      //全球矢量中文标注服务
      viewer.imageryLayers.addImageryProvider(
        new WebMapTileServiceImageryProvider({
          url:
            "http://t0.tianditu.com/cva_w/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cva&tileMatrixSet=w&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default.jpg&tk=93d1fdef41f93d2211deed6d22780c48",
          layer: "tdtAnnoLayer",
          style: "default",
          format: "image/jpeg",
          tileMatrixSetID: "GoogleMapsCompatible"
        })
      );
    }
  }
};
</script>

<style lang="stylus" scoped>
.CesiumViewer {
  width: 100%;
  height: 100%;
  background: #333;
  position: relative;
  overflow: hidden;

  #cesiumContainer {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .printer-btn {
    position: absolute;
    top: 10px;
    left: 10px;
  }
}
</style>
