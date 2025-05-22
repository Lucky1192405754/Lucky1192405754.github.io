from PIL import Image, ImageDraw

def create_vertical_gradient(size, top_color, middle_color, bottom_color):
    width, height = size
    gradient = Image.new('RGB', size, color=0)
    draw = ImageDraw.Draw(gradient)
    for y in range(height):
        t = y / (height - 1)
        if t < 0.5:
            f = t * 2
            c0, c1 = bottom_color, middle_color
        else:
            f = (t - 0.5) * 2
            c0, c1 = middle_color, top_color
        r = int(c0[0] * (1 - f) + c1[0] * f)
        g = int(c0[1] * (1 - f) + c1[1] * f)
        b = int(c0[2] * (1 - f) + c1[2] * f)
        draw.line([(0, y), (width, y)], fill=(r, g, b))
    return gradient

def load_and_scale(path, canvas_size, max_frac_w=1, max_frac_h=1):
    img = Image.open(path).convert("RGBA")
    cw, ch = canvas_size
    max_w, max_h = cw * max_frac_w, ch * max_frac_h
    scale = min(max_w / img.width, max_h / img.height, 1.0)
    new_size = (int(img.width * scale), int(img.height * scale))
    return img.resize(new_size, resample=Image.Resampling.LANCZOS)

def composite_images(img_paths, output_path="output.png"):
    # 1) 画布与渐变背景
    canvas_size = (2560, 1440)
    bottom_color = (255, 255, 255)
    middle_color = (255, 255, 255)
    top_color = (255, 255, 255)
    bg = create_vertical_gradient(canvas_size, top_color, middle_color, bottom_color).convert("RGBA")

    # 2) 加载并缩放所有输入图
    imgs = [load_and_scale(p, canvas_size) for p in img_paths]

    # 3) 计算位置并贴图
    if len(imgs) == 1:
        img = imgs[0]
        x = canvas_size[0] - img.width       # 右边缘
        y = canvas_size[1] - img.height      # 底边缘
        bg.paste(img, (x, y), img)

    elif len(imgs) == 2:
        img0, img1 = imgs
        # 左下
        bg.paste(img0, (0, canvas_size[1] - img0.height), img0)
        # 右下
        bg.paste(img1, (canvas_size[0] - img1.width, canvas_size[1] - img1.height), img1)

    else:
        raise ValueError(f"目前仅支持 1 或 2 张输入图，传入了 {len(imgs)} 张")

    # 4) 保存
    bg.save(output_path)
    print(f"✅ 合并图像已保存为 {output_path}")

if __name__ == "__main__":
    # 一张图示例（放右下）：
    composite_images(["img_1.png"])

    # 两张图示例：
    # composite_images(["img_0.png", "img_1.png"])
