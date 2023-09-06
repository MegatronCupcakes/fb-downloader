/**
 *
 * @param {string} videoUrl - Facebook video URL (required)
 * @param {string} [cookie] - Facebook cookie (optional)
 * @param {string} [useragent] - User agent (optional)
 */
export default function getVideoInfo(
    videoUrl: string,
    cookie?: string,
    useragent?: string
): Promise<VideoInfo>;

export interface VideoInfo {
    url: string;
    videoId: string;
    videoStream: string;
    audioStream: string;
    thumbnail: string;
}
