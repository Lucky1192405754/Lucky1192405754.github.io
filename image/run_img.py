from pathlib import Path
from PIL import Image

def batch_convert_to_webp(quality=80):
    """
    将当前目录下的常用图片转换为 WebP 格式
    :param quality: 压缩质量，范围 0-100，数值越小压缩比越大，80 是一个画质和体积平衡较好的推荐值
    """
    # 定义需要处理的图片扩展名（小写）
    supported_extensions = {".jpg", ".jpeg", ".png", ".bmp", ".tiff"}
    
    # 获取当前脚本运行的目录
    current_dir = Path(".")
    
    # 统计数据
    success_count = 0
    fail_count = 0

    print("🔄 开始批量转换图片为 WebP...")
    print("-" * 40)

    # 遍历当前目录下的所有文件
    for file_path in current_dir.iterdir():
        # 确保是文件，且后缀名在支持的列表中（统一转小写比较）
        if file_path.is_file() and file_path.suffix.lower() in supported_extensions:
            try:
                # 生成新的文件路径：保持文件名不变，仅替换后缀为 .webp
                new_file_path = file_path.with_suffix(".webp")
                
                # 打开图片
                with Image.open(file_path) as img:
                    # 如果图片是调色板模式 (P) 或具有透明通道的某些格式，
                    # 强转为 RGBA 可以保证透明度被正确保留到 WebP
                    if img.mode not in ("RGB", "RGBA"):
                        img = img.convert("RGBA")
                        
                    # 保存为 WebP 格式并应用压缩质量
                    img.save(new_file_path, "webp", quality=quality)
                
                print(f"✅ 成功: {file_path.name} -> {new_file_path.name}")
                success_count += 1
                
            except Exception as e:
                print(f"❌ 失败: {file_path.name} | 错误信息: {e}")
                fail_count += 1

    print("-" * 40)
    print(f"🎉 转换完成！成功: {success_count} 张，失败: {fail_count} 张。")

if __name__ == "__main__":
    # 运行转换，你可以通过修改这里的参数来调整压缩比
    batch_convert_to_webp(quality=80)