#!/usr/bin/env python3
"""Regenerate MCP terminal demo GIF for README (matches site MCP section script)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

OUT = Path(__file__).with_name("mcp-terminal-demo.gif")

LINES = [
    ("prompt", "You:"),
    ("user", "Migrate my app from AWS to Hetzner."),
    ("prompt", "AI Agent:"),
    ("ai", "Loading tools from Devopness MCP server ..."),
    ("action", "→ Provisioning new server on Hetzner"),
    ("action", "→ Deploying app from GitHub to new server"),
    ("success", "✓ App live on Hetzner. AWS server still running."),
    ("user", "Looks good. Remove the AWS server."),
    ("action", "→ Removing AWS server"),
    ("success", "✓ Migration complete."),
]

COLORS = {
    "bg": (15, 17, 23),
    "header": (30, 33, 42),
    "title": (180, 185, 195),
    "prompt": (120, 130, 150),
    "user": (230, 230, 235),
    "ai": (160, 170, 255),
    "action": (120, 200, 255),
    "success": (90, 220, 140),
    "cursor": (255, 140, 60),
}

W, H = 720, 420
PAD = 24
LINE_H = 22


def load_fonts():
    for path in (
        "/System/Library/Fonts/Menlo.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf",
    ):
        try:
            return (
                ImageFont.truetype(path, 14),
                ImageFont.truetype(path, 13),
            )
        except OSError:
            continue
    default = ImageFont.load_default()
    return default, default


def draw_frame(draw_ctx: ImageDraw.ImageDraw, visible_count: int, show_cursor: bool, font, font_b) -> None:
    draw_ctx.rounded_rectangle([0, 0, W - 1, H - 1], radius=12, outline=(50, 55, 70), width=2)
    draw_ctx.rounded_rectangle([0, 0, W - 1, 36], radius=12, fill=COLORS["header"])
    draw_ctx.rectangle([0, 24, W, 36], fill=COLORS["header"])
    for i, color in enumerate([(255, 95, 86), (255, 189, 46), (39, 201, 63)]):
        draw_ctx.ellipse([16 + i * 18, 12, 28 + i * 18, 24], fill=color)
    draw_ctx.text((W // 2 - 95, 10), "AI + Devopness MCP", fill=COLORS["title"], font=font_b)

    y = 52
    for kind, text in LINES[:visible_count]:
        if kind == "prompt":
            draw_ctx.text((PAD, y), text, fill=COLORS["prompt"], font=font_b)
        else:
            draw_ctx.text((PAD, y), text, fill=COLORS.get(kind, COLORS["user"]), font=font)
        y += LINE_H

    if show_cursor and visible_count < len(LINES):
        draw_ctx.text((PAD, y), "▋", fill=COLORS["cursor"], font=font)


def main() -> None:
    font, font_b = load_fonts()
    frames: list[Image.Image] = []

    for visible in range(len(LINES) + 1):
        for _ in range(4):
            img = Image.new("RGB", (W, H), COLORS["bg"])
            draw = ImageDraw.Draw(img)
            draw_frame(draw, visible, visible < len(LINES), font, font_b)
            frames.append(img)

    for _ in range(20):
        img = Image.new("RGB", (W, H), COLORS["bg"])
        draw = ImageDraw.Draw(img)
        draw_frame(draw, len(LINES), False, font, font_b)
        frames.append(img)

    for _ in range(5):
        img = Image.new("RGB", (W, H), COLORS["bg"])
        draw = ImageDraw.Draw(img)
        draw_frame(draw, 0, True, font, font_b)
        frames.append(img)

    frames[0].save(
        OUT,
        save_all=True,
        append_images=frames[1:],
        duration=100,
        loop=0,
        optimize=True,
    )
    print(f"Wrote {OUT} ({len(frames)} frames)")


if __name__ == "__main__":
    main()
