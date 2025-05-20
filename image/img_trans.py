from PIL import Image

def resize_and_pad_transparent(image_path, output_path, size=32):
    """
    将图片按比例缩放并居中，输出一个透明背景的 size×size 大小图像。

    :param image_path:  输入图片路径
    :param output_path: 输出图片保存路径（建议以 .png 结尾）
    :param size:        目标正方形边长（像素），默认为 32
    """
    # 打开源图并转换为 RGBA，以便处理透明通道
    im = Image.open(image_path).convert("RGBA")
    
    # 计算缩放比例并调整尺寸
    w, h = im.size
    scale = min(size / w, size / h)
    new_w, new_h = int(w * scale), int(h * scale)
    im_resized = im.resize((new_w, new_h), Image.LANCZOS)
    
    # 新建透明背景画布
    background = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    
    # 计算居中粘贴位置
    paste_x = (size - new_w) // 2
    paste_y = (size - new_h) // 2
    
    # 粘贴并保留透明度
    background.paste(im_resized, (paste_x, paste_y), im_resized)
    
    # 直接保存为 PNG，透明背景会保留
    background.save(output_path, format="PNG")

# 示例用法
if __name__ == "__main__":
    resize_and_pad_transparent("planet.png", "planet_output.png")
