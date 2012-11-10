/**
 * Force push
 */
Game.Push = function(being, direction) {
	Game.Force.call(this, being, direction, "push", 1, 
					Game.Rules.PUSH_FORCE_MIN, Game.Rules.PUSH_FORCE_MAX);
}
Game.Push.extend(Game.Force);
